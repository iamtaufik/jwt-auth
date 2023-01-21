const getProducts = async (req, res) => {
  const products = [
    { id: 1, name: 'product 1', price: 200 },
    { id: 2, name: 'product 2', price: 100 },
    { id: 3, name: 'product 3', price: 300 },
  ];

  res.status(200).json(products);
};

module.exports = { getProducts };
