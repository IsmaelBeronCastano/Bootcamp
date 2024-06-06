"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("../config");
const stripe_1 = require("stripe");
let PaymentsService = class PaymentsService {
    constructor() {
        this.stripe = new stripe_1.default(config_1.envs.stripeSecret);
    }
    async createPaymentSession(paymentSessionDto) {
        const { currency, items, orderId } = paymentSessionDto;
        const lineItems = items.map((item) => {
            return {
                price_data: {
                    currency: currency,
                    product_data: {
                        name: item.name,
                    },
                    unit_amount: Math.round(item.price * 100),
                },
                quantity: item.quantity,
            };
        });
        const session = await this.stripe.checkout.sessions.create({
            payment_intent_data: {
                metadata: {
                    orderId: orderId
                },
            },
            line_items: lineItems,
            mode: 'payment',
            success_url: config_1.envs.stripeSuccessUrl,
            cancel_url: config_1.envs.stripeCancelUrl,
        });
        return session;
    }
    async stripeWebhook(req, res) {
        const sig = req.headers['stripe-signature'];
        let event;
        const endpointSecret = config_1.envs.stripeEndpointSecret;
        try {
            event = this.stripe.webhooks.constructEvent(req['rawBody'], sig, endpointSecret);
        }
        catch (err) {
            res.status(400).send(`Webhook Error: ${err.message}`);
            return;
        }
        switch (event.type) {
            case 'charge.succeeded':
                const chargeSucceeded = event.data.object;
                console.log({
                    metadata: chargeSucceeded.metadata,
                    orderId: chargeSucceeded.metadata.orderId,
                });
                break;
            default:
                console.log(`Event ${event.type} not handled`);
        }
        return res.status(200).json({ sig });
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)()
], PaymentsService);
//# sourceMappingURL=payments.service.js.map