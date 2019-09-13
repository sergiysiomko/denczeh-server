var express = require('express');
var createError = require('http-errors');
var router = express.Router();

const infoPages = ['aboutCzech','perspectiva','pratsevlashtuvannya','answers','services'];
router.get("/twoYear",(req,res) => {
        res.render('info/twoYear');
})
router.get("/:name",(req, res)=>{
    let name = req.params.name;
    if(infoPages.includes(name))
        res.render("info/"+name);
    else    
        res.redirect("/");
})


module.exports = router;