export const baseTypes = `#graphql
  input QueryData {
    sales: CreateSalesInput
  }

  input EventBrokerInput {
    type: String!
    event: String!
    queryData: QueryData
  }

  type Query {
    service: String!
  }

  type Mutation {
    sendEvent(input: EventBrokerInput!): Response!
  }
`;
