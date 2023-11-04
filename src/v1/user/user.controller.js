const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const stripe = require("../../configs/stripe.js");

const User = require("./user.model.js");
const errorHandler = require("../../utils/errorHandler");

const signupUser = errorHandler(async (req, res, next) => {
  const name = req.body.name.trim();
  const email = req.body.email.trim();
  const password = req.body.password.trim();

  if (!name || !email || !password) {
    res.status(406).json({ message: "Missing values!" });
    return;
  }

  const existingUser = await User.findOne({
    email: email,
  }).exec();

  if (existingUser) {
    res.status(406).json({ message: "Email already exists!" });
    return;
  }

  const resolves = await Promise.all([
    bcrypt.hash(password, 10),
    stripe.customers.create({
      name: name,
      email: email,
    }),
  ]);

  const hashedPassword = resolves[0];
  const stripeUser = resolves[1];

  await User.create({
    name: name,
    email: email,
    stripe_id: stripeUser.id,
    password: hashedPassword,
  });

  res.status(201).json({ message: "User Created!" });
});

const loginUser = errorHandler(async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    res.status(406).json({ message: "Missing values!" });
    return;
  }

  const user = await User.findOne({
    email: email,
  }).exec();

  if (!user) {
    res.status(404).json({ message: "User with provided email not found" });
    return;
  }

  const matched = await bcrypt.compare(password, user.password);

  if (!matched) {
    res.status(401).json({ message: "Incorrect Password" });
    return;
  }

  const token = jwt.sign(
    {
      userId: user.id,
    },
    process.env.JWT_PASSWORD_KEY,
    { expiresIn: "7d" }
  );

  res.status(202).json({ message: "Login Successful!", token: token });
});

const getUser = errorHandler(async (req, res, next) => {
  const userId = req.userId;

  const user = await User.findById(userId);

  delete user.password;

  res.json(user);
});

module.exports = { signupUser, loginUser, getUser };
