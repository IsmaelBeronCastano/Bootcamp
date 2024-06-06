import { PaginationDto } from 'src/common';
import { OrderStatus } from '../enum/order.enum';
export declare class OrderPaginationDto extends PaginationDto {
    status: OrderStatus;
}
