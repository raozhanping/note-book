var cheerio = require('cheerio');
var path = require('path');
var fs = require('fs');

var modifyPage = function ($) {
  $('li.chapter:has(ul.articles)').each(function(){
    $(this).children('a').after('<i class="fa fa-eye expand" aria-hidden="true"></i>');
  });
  $('.active').parents().siblings('.expand').addClass('fa-eye-slash');
  return $.html();
}

var urls = [];

module.exports = {
  website: {
    assets: "./book",
    js: [
    "toggle.js"
    ],
    css: [
    "toggle.css"
    ],
    html: {
      "html:start": function() {
        return "<!-- Start book "+this.options.title+" -->"
      },
      "html:end": function() {
        return "<!-- End of book "+this.options.title+" -->"
      },

      "head:start": "<!-- head:start -->",
      "head:end": "<!-- head:end -->",

      "body:start": "<!-- body:start -->",
      "body:end": "<!-- body:end -->"
    }
  },
  hooks: {
// For all the hooks, this represent the current generator

// This is called before the book is generated
"init": function() {
//console.log("init!");
},

"page": function (page) {
  if (this.output.name != 'website') return page;

  var lang = this.isLanguageBook() ? this.config.values.language : '';
  if (lang) lang = lang + '/';

  var outputUrl = this.output.toURL('_book/' + lang + page.path);

  urls.push({
    url: outputUrl + (outputUrl.substr(-5, 5) !== '.html' ? 'index.html' : '')
  });
  return page;
},

// This is called after the book generation
"finish": function() {
  urls.forEach(item => {
    html = fs.readFileSync(item.url, {encoding: 'utf-8'});
    $ = cheerio.load(html);
    var newPage = modifyPage($);
    fs.writeFileSync(item.url, newPage);
  });
}

}
};
