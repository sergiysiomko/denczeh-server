const profiles = document.getElementById("profiles");
const TOP_INDENT = 120;
const MOBILE_SCREEN_WIDTH = 750;

if (profiles) {
  window.addEventListener("scroll", scrollHandler);
}
function scrollHandler() {
  if (!profiles || document.body.clientWidth <= MOBILE_SCREEN_WIDTH) {
    return;
  }

  const BOTTOM_INDENT = -15 + document.getElementById("contacts").clientHeight;
  const PAGE_HEIGHT = document.body.clientHeight;

  let top = 0;
  if (pageYOffset < TOP_INDENT) {
    top = 125 - pageYOffset;
  } else if (pageYOffset >= TOP_INDENT) {
    top = 5;

    let ledge =
      PAGE_HEIGHT - BOTTOM_INDENT - pageYOffset - profiles.clientHeight;

    if (ledge < 0) {
      top = ledge;
    }
  }

  profiles.style.top = top + "px";
}
