export declare class PaymentSessionDto {
    orderId: string;
    currency: string;
    items: PaymentSessionItemDto[];
}
export declare class PaymentSessionItemDto {
    name: string;
    price: number;
    quantity: number;
}
