import { Injectable } from "@nestjs/common";

@Injectable()
export class RandomService {
  findAll() {
    return Math.floor(Math.random() * 1000);
  }
}
