const express = require('express');
const createError = require('http-errors');
const router = express.Router();
const Vacancies = require('../dbmodels/vacancy-model');
const passport = require('passport');
const multer  = require('multer')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let dir  = __dirname.split('\\');
    dir.length = dir.length - 1;
    dir = dir.join('\\')
    cb(null,  dir +'\\public\\img\\vacancies')
  },
  filename: function (req, file, cb) {
    let filename = file.originalname.split('.');
    filename.reverse();
    let type = filename.shift();
    filename.reverse();
    cb(null, `${filename}-${Date.now()}.${type}`)
  }
})
const upload = multer({ storage }) 

router.get('/', async function(req, res, next) {
  let vacancies = await Vacancies.find({})
  
  vacancies.reverse()
  res.render('vacancies',{vacancies})
})

router.get('/add', passport.isLoggedIn, async function(req, res, next){
  res.render('add')
})
const cpUpload = upload.fields([{ name: 'faceImage', maxCount: 1 }, { name: 'images', maxCount: 20 }])
router.post('/add',passport.isLoggedIn, cpUpload, async function(req, res, next){
  
  try {
    req.body.images = req.files['images'].map(
                                          (img) => '/img/vacancies/' + img.filename
                                        )
    req.body.faceImage='/img/vacancies/' + req.files['faceImage'][0].filename;
    req.body.experience = !!req.body.experience;
    req.body.lang = !!req.body.lang;
    req.body.link = req.body.link||rus_to_latin(req.body.title)
    
    let newVacancy = new Vacancies(req.body);
   await newVacancy.save();
    res.redirect('/vacancies/add')
  } catch (error) {
    res.render('error', {error})
  }
  
})


router.get('/list', passport.isLoggedIn, function(req, res){
  Vacancies.find({}, (error, vacancies)=>{
    if(error){
      console.log(error);
      res.render('error', {error})
      return;
    }
    res.render('vacancies-list', {vacancies})
  }
    )
})
router.get('/:link', async function(req, res, next) {
  try {
    let vacancy = await Vacancies.findOne({link:req.params.link})
    if(vacancy){
      //vacancy.faceImage='/img/little/polskaworker.jpg'
      console.log(vacancy);
      //await vacancy.save()

      res.render('vacancy', {vacancy});
      
    }
    else{
      //next(createError(404))
      res.redirect('/')
    }
  } catch (error) {
    next(error)
  }
  // let vacancy = await Vacancy.findOne({link:req.params.link})
  // res.render('vacancy', {vacancy:vacancy});
})

router.get('/type/:category', async (req, res) => {
  let ctg = req.params.category;
  let vacancies = await Vacancies.find({category:ctg})
  if(vacancies.length == 0){
    res.redirect('/vacancies')
  }
  else
    res.render('vacancies',{vacancies})
})



router.get('/json/:link', async function(req, res, next) {
 
  try{
    let vacancy = await Vacancies.findOne({link:req.params.link})
    if(vacancy)
      res.json(vacancy)
    else
      next(createError(404));
  }
  catch(err){
    next(createError(500));
  }
});



module.exports = router;


function rus_to_latin ( str ) {
    
  var ru = {
      'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 
      'е': 'e', 'ё': 'e', 'ж': 'j', 'з': 'z', 'и': 'i', 
      'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 
      'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 
      'ф': 'f', 'х': 'h', 'ц': 'c', 'ч': 'ch', 'ш': 'sh', 
      'щ': 'shch', 'ы': 'y', 'э': 'e', 'ю': 'u', 'я': 'ya',' ':'-'
  }, n_str = [];
  
  str = str.replace(/[ъь]+/g, '').replace(/й/g, 'i');
  
  for ( var i = 0; i < str.length; ++i ) {
     n_str.push(
            ru[ str[i] ]
         || ru[ str[i].toLowerCase() ] == undefined && str[i]
         || ru[ str[i].toLowerCase() ].replace(/^(.)/, function ( match ) { return match.toUpperCase() })
     );
  }
  
  return n_str.join('');
}