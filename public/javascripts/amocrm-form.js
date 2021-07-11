document.addEventListener('DOMContentLoaded', handleFormLoaded);
function handleFormLoaded() {
  console.log('DOMContentLoaded event');

  let elOpenFormButton = document.getElementById('openFormButton');
  if (!elOpenFormButton) return;

  elOpenFormButton.addEventListener('click', handleFormOpen);
}

function handleFormOpen() {
  console.log('open form event');

  //   let elVacancyHiddenInput = document.querySelector('#amoforms_form .amoforms__fields__container input');

  //   elVacancyHiddenInput.value = '1234';

  let elForm = document.getElementById('amoforms_iframe_806191').contentWindow.document.getElementById('amoforms_form');
}
