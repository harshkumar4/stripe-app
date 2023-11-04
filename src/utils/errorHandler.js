const asyncErrorHandler = (asyncFn) => {
    return async (req, res, next) => {
      try {
        await asyncFn(req, res, next);
      } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    };
  };

module.exports = asyncErrorHandler;
  