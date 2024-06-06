import { PaginationDto } from 'src/common';
import { OrderStatus } from '@prisma/client';
export declare class OrderPaginationDto extends PaginationDto {
    status: OrderStatus;
}
