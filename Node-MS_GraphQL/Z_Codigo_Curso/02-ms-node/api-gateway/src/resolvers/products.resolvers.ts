export const productsQuerys = {
  getAllProducts: (_, { input: { event } }, context) => {
    console.log(event);

    return {
      name: "Teclado Mecanico",
      price: 150,
    };
  },
};
