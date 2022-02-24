const unescapeHTML = (escapedHTML) => {
    if (escapedHTML) return escapedHTML.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');
};

module.exports = {
    unescapeHTML
};
