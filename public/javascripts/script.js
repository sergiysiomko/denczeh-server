init();

function init() {
  menu();
  counter();
  tabs();
  vacanciesCategoriesCheck();
  gtag();
  videoGalary();
  select();
}
function select() {
  $(document).ready(function() {
    $("select").formSelect();
  });
}
function vacanciesCategoriesCheck() {
  var categories = { vacancies: 0, czech: 1, polska: 2, openviza: 3 };
  var buttons = document.querySelectorAll(".vacancies-ctg a");
  if (buttons.length == 0) return;
  var ctg = window.location.href.split("/").reverse()[0];

  buttons[categories[ctg]].classList.add("selected");
}
function menu() {
  // sidenav
  $(".sidenav").sidenav();

  // menu highlight

  let items = $("#mobile-demo li");
  const color = "rgb(255, 168, 168)";
  for (let i = 0; i < items.length; i++) {
    let a = $(items[i]).children("a");
    if (window.location.href == a.attr("href")) {
      a.css("color", color);
      $(a)
        .children()
        .css("color", color);
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
  gtag("js", new Date());

  gtag("config", "UA-113291240-2");
}
function tabs() {
  $(document).ready(function() {
    $(".tabs").tabs();
  });
}
function videoGalary() {
  //  Set caption from card text
  /*
		variables
	*/

  var $imagesSlider = $(".gallery-slider .gallery-slider__images>div"),
    $thumbnailsSlider = $(".gallery-slider__thumbnails>div");

  /*
sliders
*/

  // images options
  $imagesSlider.slick({
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    cssEase: "linear",
    fade: true,
    draggable: false,
    asNavFor: ".gallery-slider__thumbnails>div",
    prevArrow: ".gallery-slider__images .prev-arrow",
    nextArrow: ".gallery-slider__images .next-arrow"
  });

  // thumbnails options
  $thumbnailsSlider.slick({
    speed: 300,
    slidesToShow: 5,
    slidesToScroll: 1,
    cssEase: "linear",
    centerMode: true,
    draggable: false,
    focusOnSelect: true,
    asNavFor: ".gallery-slider .gallery-slider__images>div",
    prevArrow: ".gallery-slider__thumbnails .prev-arrow",
    nextArrow: ".gallery-slider__thumbnails .next-arrow",
    responsive: [
      {
        breakpoint: 720,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4
        }
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3
        }
      },
      {
        breakpoint: 350,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2
        }
      }
    ]
  });

  /* 
captions
*/

  var $caption = $(".gallery-slider .caption");

  // get the initial caption text
  var captionText = $(".gallery-slider__images .slick-current img").attr("alt");
  updateCaption(captionText);

  // hide the caption before the image is changed
  $imagesSlider.on("beforeChange", function(
    event,
    slick,
    currentSlide,
    nextSlide
  ) {
    $caption.addClass("hide");
  });

  // update the caption after the image is changed
  $imagesSlider.on("afterChange", function(
    event,
    slick,
    currentSlide,
    nextSlide
  ) {
    captionText = $(".gallery-slider__images .slick-current img").attr("alt");
    updateCaption(captionText);
  });

  function updateCaption(text) {
    // if empty, add a no breaking space
    if (text === "") {
      text = "&nbsp;";
    }
    $caption.html(text);
    $caption.removeClass("hide");
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
            from: $(this).data("from"),
            to: $(this).data("to"),
            speed: $(this).data("speed"),
            refreshInterval: $(this).data("refresh-interval"),
            decimals: $(this).data("decimals")
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
          data = $self.data("countTo") || {};

        $self.data("countTo", data);

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

          if (typeof settings.onUpdate == "function") {
            settings.onUpdate.call(self, value);
          }

          if (loopCount >= loops) {
            // remove the interval
            $self.removeData("countTo");
            clearInterval(data.interval);
            value = settings.to;

            if (typeof settings.onComplete == "function") {
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
      onComplete: null // callback method for when the element finishes updating
    };

    function formatter(value, settings) {
      return value.toFixed(settings.decimals);
    }
  })(jQuery);

  jQuery(function($) {
    // custom formatting example
    $(".count-number").data("countToOptions", {
      formatter: function(value, options) {
        return value
          .toFixed(options.decimals)
          .replace(/\B(?=(?:\d{3})+(?!\d))/g, ",");
      }
    });

    // start all the timers
    $(".timer").each(count);

    function count(options) {
      var $this = $(this);
      options = $.extend({}, options || {}, $this.data("countToOptions") || {});
      $this.countTo(options);
    }
  });
}
