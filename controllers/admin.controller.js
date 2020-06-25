const passport = require("passport");
const { render } = require("./utils");
const { NotExtended } = require("http-errors");

function userPage(req, res) {
  let { login } = req.user;
  render(req, res, "admin/user", { login });
}
function adminPage(req, res) {
  render(req, res, "admin/admin");
}
function loginPage(req, res) {
  render(req, res, "admin/login");
}
function registerPage(req, res) {
  render(req, res, "admin/register");
}

function logout(req, res) {
  req.logout();
  res.redirect("/");
}

module.exports = {
  userPage,
  adminPage,
  loginPage,
  registerPage,
  logout,
};
