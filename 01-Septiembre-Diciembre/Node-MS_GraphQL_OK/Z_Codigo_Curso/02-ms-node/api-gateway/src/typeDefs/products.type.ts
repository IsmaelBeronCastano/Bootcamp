export const productsTypes = `#graphql

  type Product {
    id: ID
    description: String
    name: String
    price: Int
  }

  type Products {
    products: [Product]
  }

`;
