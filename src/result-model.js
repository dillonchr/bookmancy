const MODEL = {
  about: "",
  price: "",
  image: null,
  sold: false,
  url: "",
  date: 0,
  year: "",
  shipping: ""
};

module.exports = result => {
  return { ...MODEL, ...result };
};
