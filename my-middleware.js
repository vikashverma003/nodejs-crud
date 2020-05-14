module.exports = function (options) {
    return function (req, res, next) {
        console.log("my middleware working");
      // Implement the middleware function based on the options object
      next()
    }
  }
  