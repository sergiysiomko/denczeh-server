var express = require('express');
var createError = require('http-errors');
var router = express.Router();
var Vacancy = require('../dbmodels/vacancy-model');


router.get('/add',async function(req, res, next){
  res.render('add')
})
router.post('/add',async function(req, res, next){
  req.body.images=[];
  req.body.faceImage='/img/vacancies';
  req.body.experience = !!req.body.experience;
  req.body.lang = !!req.body.lang;
  req.body.link = req.body.link||rus_to_latin(req.body.title)
  console.log(req.body)
  let newVacancy = new Vacancy(req.body);
  await newVacancy.save();
  res.redirect('/vacancies/add')
})

router.get('/', async function(req, res, next) {
  let vacancies = await Vacancy.find({})
  
  vacancies.reverse()
  res.render('vacancies',{vacancies})
})
router.get('/:link', async function(req, res, next) {
  try {
    let vacancy = await Vacancy.findOne({link:req.params.link})
    if(vacancy){
      //vacancy.faceImage='/img/little/polskaworker.jpg'
      console.log(vacancy);
      await vacancy.save()

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
  let vacancies = await Vacancy.find({category:ctg})
  if(vacancies.length == 0){
    res.redirect('/vacancies')
  }
  else
    res.render('vacancies',{vacancies})
})



router.get('/json/:link', async function(req, res, next) {
  /*console.log(req.params.link);
  let v = new Vacancy({
    title:"Карщики",
    payment:100,
    currency:"крон/год",
    faceImage:"img/vacancies/karshch1.jpg",
    description:"Карщики",
    bigDescription:'<p>Країна: Чехія</p><p>Місто: Прага</p><p>ВИМОГИ:</p><p>Вік: від 18 до 45</p><p>Знання мови: бажано, але не обов&rsquo;язково</p><p>Досвід роботи: ОБОВЯЗКОВО&nbsp;</p><p>&nbsp;</p><p>НЕОБХІДНІ ДОКУМЕНТИ:</p><p>Паспорт громадянина України</p><p>Закордонний паспорт</p><p>Індикаційний код</p><p>При оформленні документів в офісі ви лишаєте&nbsp; копії ваших документів</p><p>&nbsp;</p><p>УМОВИ ПРАЦІ ТА ПРОЖИВАННЯ</p><p>Потрібні водії автопогрузчиків (передні вили від 1,5 тони, ретрак бокові вили). Наявність документів європейського зразка &ndash; бажано, наявність водійських прав категорії&nbsp; В , в такому разі є можливість оформити права на автопогрузчик по місцю роботи.</p><p>Графік роботи: 5-6 робочих днів.</p><p>Оплата: від 110 до 130&nbsp; крон/год в залежності від погрузчика</p><p>Кількість робочих годин: 240-280 в місяць</p><p>Можливість брати аванси кожного тижня</p><p>Проживання: надаються гуртожитки сімейного типу (битовня). Чоловіки , жінки по 3-4 людини в кімнаті, сімейні пари окремо.</p><p>Вартість житла: 4000 крон</p><p>На протязі всього терміну роботи за вами закріплюється координатор, який займається питаннями пов&rsquo;язаними з поселенням, графіком роботи, трансфером та отриманням авансів.</p><p>&nbsp;</p><p>Працевлаштування здійснюється тільки за робочими візами на підставі запрошення від даного роботодавця.<br /> Оформляємо повний пакет документів для подачі у візовий центр на відкриття робочої візи.</p>',
    location:"Прага/Чехія",
    images:["img/vacancies/karshch1.jpg", "img/vacancies/karshch2.jpg"],
    link:"karshch1",
    category: "по професії",
    experience:true,
    lang:false
  })
  await v.save()*/
  try{
    let vacancy = await Vacancy.findOne({link:req.params.link})
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