module.exports = options => {
  let url = 'https://www.abebooks.com/servlet/SearchResults?bx=off&ds=50&recentlyadded=all&sortby=17&sts=t';
  if(options.publisher) {
    url += '&pn=' + encodeURIComponent(options.publisher);
  }
  if(options.author) {
    url += '&an=' + encodeURIComponent(options.author);
  }
  if(options.title) {
    url += '&tn=' + encodeURIComponent(options.title);
  }
  if(options.year && !isNaN(options.year) && options.year.length === 4) {
    url += '&yrh=' + encodeURIComponent(options.year);
  }
  let format = '0';
  if(options.format) {
    if(options.format === 'hardcover') {
      format = 'h';
    } else if(options.format === 'softcover') {
      format = 's';
    }
  }
  url += '&bi=' + format;
  return url;
};
