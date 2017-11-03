const MODEL = {
    about: '',
    price: '',
    image: null,
    sold: false,
    url: '',
    date: 0,
    year: '',
    shipping: ''
};

module.exports = r => Object.assign({}, MODEL, r);
