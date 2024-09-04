import { RESTDataSource } from "@apollo/datasource-rest";

export class EventBrokerAPI extends RESTDataSource {
  override baseURL: string = "http://localhost:3001/";

  async emitEvent(event: string, data: any) {
    return this.post("/events", { body: { event, data } });
  }
}
