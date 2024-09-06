import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

import dotenv from "dotenv";

import { typeDefs } from "./typeDefs";
import { resolvers } from "./resolvers";

import { EventBrokerAPI } from "./datasources/eventBroker.datasource";

dotenv.config();

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: {
    port: parseInt(process.env.PORT),
  },
  context: async () => {
    const { cache } = server;

    return {
      dataSources: {
        eventBrokerAPI: new EventBrokerAPI({ cache }),
      },
    };
  },
});

console.log(`GraphQL API Gateway started: ${url}`);
