import { CardTokenParams } from "../../Data/sources/remote/models/CardTokenParams";
import { IdentificationType } from "../entities/IdentificationType";
import { ResponseMercadoPagoCardToken } from '../../Data/sources/remote/models/ResponseMercadoPagoCardToken';
import { ResponseMercadoPagoInstallments } from "../../Data/sources/remote/models/ResponseMercadoPagoIntallments";
import { PaymentParams } from '../../Data/sources/remote/models/PaymentParams';
import { ResponseApiDelivery } from '../../Data/sources/remote/models/ResponseApiDelivery';

export interface MercadoPagoRepository {

    getIdentificationTypes(): Promise<IdentificationType[]>;
    getInstallments(bin: string, amount: number): Promise<ResponseMercadoPagoInstallments>;
    createCardToken(cardTokenParams: CardTokenParams): Promise<ResponseMercadoPagoCardToken>;
    createPayment(paymentParams: PaymentParams): Promise<ResponseApiDelivery>;

}