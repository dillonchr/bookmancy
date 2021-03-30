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
  const shipping = el.querySelector(".item-shipping");

  if (shipping) {
    const amount = shipping.text.match(/US\$ ([\d.]+)/);
    if (amount) {
      return +amount[1];
    } else if (/Free shipping/i.test(shipping.text)) {
      return 0.0;
    }
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
    .querySelectorAll(".cf.result-item")
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
