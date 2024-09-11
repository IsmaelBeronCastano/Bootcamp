import { OrderRepositoryImpl } from "../../../Data/repositories/OrderRepository";
import { Order } from '../../entities/Order';

const { getByStatus } = new OrderRepositoryImpl();

export const GetByStatusOrderUseCase = async (status: string) => {
  return await getByStatus(status);
}
