import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { GraphQLError } from "graphql";
import { PokemonAPI } from "./datasources/pokemon-api";

const typeDefs = `#graphql
  type Book {
    title: String
    author: String
  }

  type PokemonResult {
    name: String!
    url: String!
  }

  type Pokemon {
    count: Int!
    next: String
    previous: String
    results: [PokemonResult]!
  }

  input BookInput {
    title: String!
    author: String!
  }

  type Query {
    books: [Book]
    pokemons: Pokemon!
  }

  type Mutation {
    addBook(input: BookInput! ): Book
  }
`;

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
    books: () => books,
    pokemons: (_, __, context) => {
      return context.dataSources.pokemonAPI.getAllPokemons();
    },
  },
  Mutation: {
    addBook: (_, { input }) => {
      const { title, author } = input;

      if (title.trim() === "" || author.trim() === "") {
        throw new GraphQLError("Invalid input", {
          extensions: {
            code: "BAD_REQUEST",
          },
        });
      }

      const book = {
        title,
        author,
      };

      books.push(book);

      return book;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async () => {
    const { cache } = server;

    return {
      dataSources: {
        pokemonAPI: new PokemonAPI({ cache }),
      },
    };
  },
});

console.log(`🚀  Server ready at: ${url}`);
