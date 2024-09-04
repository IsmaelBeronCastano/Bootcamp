import { eventBrokerMutation } from "./eventBroker.resolvers";

export const resolvers = {
  Query: {
    service: () => "API Gateway",
  },
  Mutation: {
    ...eventBrokerMutation,
  },
};
