var express = require('express');
var router = express.Router();
var Vacancy = require('../dbmodels/vacancy-model');
/* GET users listing. */
router.get('/:id', async function(req, res, next) {
  console.log(req.params.id);
  let v = await Vacancy.findOne({link:req.params.id});
  res.send(v.toString());
});

module.exports = router;
