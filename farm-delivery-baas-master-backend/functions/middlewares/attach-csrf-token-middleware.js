
function attachCsrfToken(url, cookie, value) {
  return function(req, res, next) {
    if (req.url.startsWith(url)) {
      res.cookie(cookie, value);
    }
    next();
  }
}
module.exports = attachCsrfToken;