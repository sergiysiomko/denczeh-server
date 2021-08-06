init();

function init() {
  menu();
  counter();
  tabs();
  vacanciesCategoriesCheck();
  //gtag();

  gallery('#video');
  gallery('#image-reviews');

  select();

  leadForm();
  // amoCrmVisitor();
}
function select() {
  $(document).ready(function() {
    $('select').formSelect();
  });
}
function vacanciesCategoriesCheck() {
  var categories = {vacancies: 0, czech: 1, polska: 2, belgium: 3, slovakia: 4};
  var buttons = document.querySelectorAll('.vacancies-ctg a');

  if (buttons.length == 0) return;

  var ctg = window.location.href.split('/').reverse()[0];
  ctg = ctg.split('#')[0];
  buttons[categories[ctg]].classList.add('selected');
}

function menu() {
  // sidenav
  $('.sidenav').sidenav();

  // menu highlight

  let items = $('#mobile-demo li');
  const color = 'rgb(255, 168, 168)';
  for (let i = 0; i < items.length; i++) {
    let a = $(items[i]).children('a');
    if (window.location.href == a.attr('href')) {
      a.css('color', color);
      $(a)
        .children()
        .css('color', color);
      return;
    }
  }
}

function gtag() {
  // google gtag
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag('js', new Date());

  gtag('config', 'UA-113291240-2');
}
function tabs() {
  $(document).ready(function() {
    $('.tabs').tabs();
  });
}

function gallery(selector = '') {
  //  Set caption from card text
  /*
		variables
  */
  var $imagesSlider = $(`${selector} .gallery-slider .gallery-slider__images>div`),
    $thumbnailsSlider = $(`${selector} .gallery-slider__thumbnails>div`);

  /*
sliders
*/

  // images options
  $imagesSlider.slick({
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    cssEase: 'linear',
    fade: true,
    draggable: false,
    asNavFor: `${selector} .gallery-slider__thumbnails>div`,
    prevArrow: `${selector} .gallery-slider__images .prev-arrow`,
    nextArrow: `${selector} .gallery-slider__images .next-arrow`,
  });

  // thumbnails options
  $thumbnailsSlider.slick({
    speed: 300,
    slidesToShow: 5,
    slidesToScroll: 1,
    cssEase: 'linear',
    centerMode: true,
    draggable: false,
    focusOnSelect: true,
    asNavFor: `${selector} .gallery-slider .gallery-slider__images>div`,
    prevArrow: `${selector} .gallery-slider__thumbnails .prev-arrow`,
    nextArrow: `${selector} .gallery-slider__thumbnails .next-arrow`,
    responsive: [
      {
        breakpoint: 720,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 350,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
    ],
  });

  /* 
captions
*/

  var $caption = $(`${selector} .gallery-slider .caption`);

  // get the initial caption text
  var captionText = $(`${selector} .gallery-slider__images .slick-current img`).attr('alt');
  updateCaption(captionText);

  // hide the caption before the image is changed
  $imagesSlider.on('beforeChange', function(event, slick, currentSlide, nextSlide) {
    $caption.addClass('hide');
  });

  // update the caption after the image is changed
  $imagesSlider.on('afterChange', function(event, slick, currentSlide, nextSlide) {
    captionText = $(`${selector} .gallery-slider__images .slick-current img`).attr('alt');
    updateCaption(captionText);
  });

  function updateCaption(text) {
    // if empty, add a no breaking space
    if (text === '') {
      text = '&nbsp;';
    }
    $caption.html(text);
    $caption.removeClass('hide');
  }
}
function counter() {
  (function($) {
    $.fn.countTo = function(options) {
      options = options || {};

      return $(this).each(function() {
        // set options for current element
        var settings = $.extend(
          {},
          $.fn.countTo.defaults,
          {
            from: $(this).data('from'),
            to: $(this).data('to'),
            speed: $(this).data('speed'),
            refreshInterval: $(this).data('refresh-interval'),
            decimals: $(this).data('decimals'),
          },
          options
        );

        // how many times to update the value, and how much to increment the value on each update
        var loops = Math.ceil(settings.speed / settings.refreshInterval),
          increment = (settings.to - settings.from) / loops;

        // references & variables that will change with each update
        var self = this,
          $self = $(this),
          loopCount = 0,
          value = settings.from,
          data = $self.data('countTo') || {};

        $self.data('countTo', data);

        // if an existing interval can be found, clear it first
        if (data.interval) {
          clearInterval(data.interval);
        }
        data.interval = setInterval(updateTimer, settings.refreshInterval);

        // initialize the element with the starting value
        render(value);

        function updateTimer() {
          value += increment;
          loopCount++;

          render(value);

          if (typeof settings.onUpdate == 'function') {
            settings.onUpdate.call(self, value);
          }

          if (loopCount >= loops) {
            // remove the interval
            $self.removeData('countTo');
            clearInterval(data.interval);
            value = settings.to;

            if (typeof settings.onComplete == 'function') {
              settings.onComplete.call(self, value);
            }
          }
        }

        function render(value) {
          var formattedValue = settings.formatter.call(self, value, settings);
          $self.html(formattedValue);
        }
      });
    };

    $.fn.countTo.defaults = {
      from: 0, // the number the element should start at
      to: 0, // the number the element should end at
      speed: 1000, // how long it should take to count between the target numbers
      refreshInterval: 100, // how often the element should be updated
      decimals: 0, // the number of decimal places to show
      formatter: formatter, // handler for formatting the value before rendering
      onUpdate: null, // callback method for every time the element is updated
      onComplete: null, // callback method for when the element finishes updating
    };

    function formatter(value, settings) {
      return value.toFixed(settings.decimals);
    }
  })(jQuery);

  jQuery(function($) {
    // custom formatting example
    $('.count-number').data('countToOptions', {
      formatter: function(value, options) {
        return value.toFixed(options.decimals).replace(/\B(?=(?:\d{3})+(?!\d))/g, ',');
      },
    });

    // start all the timers
    $('.timer').each(count);

    function count(options) {
      var $this = $(this);
      options = $.extend({}, options || {}, $this.data('countToOptions') || {});
      $this.countTo(options);
    }
  });
}

function leadForm() {
  let elOpenLeadFormButton = document.getElementById('openLeadFormButton');
  if (!elOpenLeadFormButton) return;

  elOpenLeadFormButton.addEventListener('click', handleOpenLeadForm);
  let elForm = document.getElementById('leadForm');
  elForm.addEventListener('submit', handleLeadFormSubmit);

  let elCloseButton = document.querySelector('.popup-wrapper .close');
  elCloseButton.addEventListener('click', handleClosePopup);
}

function handleOpenLeadForm() {
  let elPopupWrapper = document.querySelector('.popup-wrapper');
  resetForm();
  elPopupWrapper.classList.add('open');
  document.body.classList.add('open-popup');
}

function handleClosePopup() {
  let elPopupWrapper = document.querySelector('.popup-wrapper');
  elPopupWrapper.classList.remove('open');
  document.body.classList.remove('open-popup');
}

function handleLeadFormSubmit(event) {
  event.preventDefault();

  resetValidation();

  let elRequiredFields = document.querySelectorAll('#leadForm input.required');

  let isValidForm = validation(elRequiredFields);
  if (isValidForm) {
    let data = getData();

    sendFormData(data).then(showThankYouInfo);
  }
}

function getData() {
  let vacancyRegion = document.querySelector('.terms .region .value').innerText;
  let vacancyName = document.querySelector('h1').innerText;
  let name = document.querySelector("#leadForm > input[name='name']").value;
  let promocode = document.querySelector("#leadForm > input[name='promocode']").value;
  let phone = document.querySelector("#leadForm > input[name='phone']").value;

  return {
    name,
    vacancyRegion,
    vacancyName,
    phone,
    promocode,
  };
}

async function sendFormData(data) {
  try {
    let url = window.location.origin + '/vacancies/lead';
    let payLoad = JSON.stringify(data);

    let response = await fetch(url, {
      method: 'POST',
      body: payLoad,
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    let json = await response.json();
    console.log(json);
  } catch (error) {
    alert('Щось пішло не так.');
    console.log(error);
  }
}

function resetForm() {
  resetValues();
  resetValidation();
  resetView();
}

function resetValues() {
  let elFields = document.querySelectorAll('#leadForm input:not([type="submit"])');

  Array.from(elFields).forEach(elField => {
    elField.value = '';
  });
}

function resetValidation() {
  let elFields = document.querySelectorAll('#leadForm input:not([type="submit"])');

  Array.from(elFields).forEach(elField => {
    elField.classList.remove('invalid');
  });
}

function resetView() {
  let elContent = document.querySelector('.popup-wrapper .content');
  elContent.classList.remove('thank-you');
}

function validation(elRequiredFields) {
  let isAllValid = true;
  Array.from(elRequiredFields).forEach(elField => {
    if (isValidField(elField) === false) {
      isAllValid = false;
      elField.classList.add('invalid');
    }
  });

  return isAllValid;
}

function isValidField(elField) {
  let pureValue = elField.value.trim();
  if (pureValue == '' || pureValue.length < 6) {
    return false;
  } else {
    return true;
  }
}

function showThankYouInfo() {
  let elContent = document.querySelector('.popup-wrapper .content');

  elContent.classList.add('thank-you');
}

/*
function amoCrmVisitor() {
  window.AMOPIXEL_IDENTIFIER_PARAMS = window.AMOPIXEL_IDENTIFIER_PARAMS || {};
  window.AMOPIXEL_IDENTIFIER_PARAMS.onload = function(pixel_identifier) {
    var visitor_uid = pixel_identifier.getVisitorUid();
    console.log('visitor_uid', visitor_uid);
  };
}
*/
