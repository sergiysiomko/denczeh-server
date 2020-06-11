var express = require("express");
const { render } = require("../controllers/utils");
var router = express.Router();

router.get("/", (req, res) => {
  render(req, res, "contacts");
});
module.exports = router;
