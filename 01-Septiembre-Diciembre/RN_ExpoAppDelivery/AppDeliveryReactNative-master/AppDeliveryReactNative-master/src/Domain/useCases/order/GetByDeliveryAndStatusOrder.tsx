import { OrderRepositoryImpl } from "../../../Data/repositories/OrderRepository";
import { Order } from '../../entities/Order';

const { getByDeliveryAndStatus } = new OrderRepositoryImpl();

export const GetByDeliveryAndStatusOrderUseCase = async (idDelivery: string, status: string) => {
  return await getByDeliveryAndStatus(idDelivery, status);
}
