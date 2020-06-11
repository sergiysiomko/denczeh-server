function rus_to_latin(str) {
  var ru = {
      а: "a",
      б: "b",
      в: "v",
      г: "g",
      д: "d",
      е: "e",
      ё: "e",
      ж: "j",
      з: "z",
      и: "i",
      к: "k",
      л: "l",
      м: "m",
      н: "n",
      о: "o",
      п: "p",
      р: "r",
      с: "s",
      т: "t",
      у: "u",
      ф: "f",
      х: "h",
      ц: "c",
      ч: "ch",
      ш: "sh",
      щ: "shch",
      ы: "y",
      э: "e",
      ю: "u",
      я: "ya",
      " ": "-",
    },
    n_str = [];

  str = str.replace(/[ъь]+/g, "").replace(/й/g, "i");

  for (var i = 0; i < str.length; ++i) {
    n_str.push(
      ru[str[i]] ||
        (ru[str[i].toLowerCase()] == undefined && str[i]) ||
        ru[str[i].toLowerCase()].replace(/^(.)/, function(match) {
          return match.toUpperCase();
        })
    );
  }

  return n_str.join("");
}

function getVideocode(link) {
  let code = "";
  if (/youtu.be/.test(link)) {
    code = link.split("/").reverse()[0];
    return code || undefined;
  }
  if (/www.youtube.com/.test(link)) {
    const reg = /v=([a-zA-Z0-9]+)/;
    let match = reg.exec(link);
    return match[1];
  }
  return "";
}
function render(req, res, page, params) {
  const auth = !!req.isAuthenticated();
  res.render(page, { auth, ...params });
}

module.exports = {
  rus_to_latin,
  getVideocode,
  render,
};
