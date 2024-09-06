export const salesTypes = `#graphql

  type Sale {
    product: Product
    quantity: Int
    price: Price
  }

  type Sales {
    sales: Sale
  }

`;
