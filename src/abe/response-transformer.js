const toResult = require("../result-model.js");

const getItemProp = (name, elem) => {
  const metaTag = elem
    .querySelectorAll("meta")
    .find(m => m.attributes.itemprop && m.attributes.itemprop === name);
  return metaTag && metaTag.attributes.content;
};

const getUrl = el => {
  const a =
    el.querySelector("[itemprop='url']") || el.querySelector("a.thumbnail");
  return a && `https://www.abebooks.com${a.attributes.href}`;
};

const getItemPrice = el => {
  let price = el.querySelector(".srp-item-price");
  if (price) {
    return price.innerHTML.substr(4);
  }
  //  probably inaccurate in most cases
  price = getItemProp("price", el);
  if (price) {
    return price;
  }
  return "???";
};

const getItemShipping = el => {
  const shipping =
    el.querySelector(".srp-item-price-shipping") ||
    el.querySelector(".shipping .price");

  if (shipping) {
    return shipping.text.substr(4);
  }

  const freeShipping = el.querySelector(".free-shipping");
  if (freeShipping) {
    return "0.00";
  }
  return "";
};

const getItemImage = el => {
  const img = el.querySelector(".result-image img");
  if (!img || !img.classNames.includes("no-book-image")) {
    return null;
  }
  return img.attributes.src;
};

module.exports = document => {
  return document
    .querySelectorAll(".cf.result")
    .map(el =>
      toResult({
        year: getItemProp("datePublished", el),
        about: getItemProp("about", el),
        price: getItemPrice(el),
        shipping: getItemShipping(el),
        image: getItemImage(el),
        url: getUrl(el)
      })
    )
    .filter(({ price }) => !isNaN(price));
};
