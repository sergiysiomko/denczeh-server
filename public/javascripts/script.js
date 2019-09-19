var categories = {'vacancies':0, 'czech':1, 'polska': 2, 'openviza': 3}
vacanciesCtg()
function vacanciesCtg(){
    var buttons = document.querySelectorAll('.vacancies-ctg a')  
    var ctg = window.location.href.split('/').reverse()[0]
    //console.log(ctg);
    buttons[categories[ctg]].classList.add('selected')
}