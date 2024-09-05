const books = [
  {
    title: "The Awakening",
    author: "Kate Chopin",
  },
  {
    title: "City of Glass",
    author: "Paul Auster",
  },
];


const resolvers = {
  Query: {
    books: ()=> books
  }
}

export const booksQuery = {
  books: () => books,
};
