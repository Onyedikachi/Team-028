module.exports = {
  catchErrors(fn) {
    const caught = (req, res, next) => fn(req, res, next).catch(next);
    return caught;
  },
  getCurrentTimeStamp() {
    return Math.floor(new Date().getTime() / 1000);
  }
};
