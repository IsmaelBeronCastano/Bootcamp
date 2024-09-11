import { typeList } from "../typelist";

export const eventBrokerMutation = {
  sendEvent: async (_, { input }, { dataSources }) => {
    const { type, event, queryData } = input;

    const typename =
      typeList
        .filter((t) => type.toLowerCase().includes(t.toLowerCase()))
        .toString() + "s";

    const { data } = await dataSources.eventBrokerAPI.emitEvent(
      event,
      queryData[typename.toLowerCase()]
    );

    const filteredData = {
      [typename.toLowerCase()]: data[typename.toLowerCase()],
    };

    return {
      __typename: typename,
      ...filteredData,
    };
  },
};
