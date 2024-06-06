"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderStatusList = void 0;
const client_1 = require("@prisma/client");
exports.OrderStatusList = [
    client_1.OrderStatus.PENDING,
    client_1.OrderStatus.DELIVERED,
    client_1.OrderStatus.CANCELLED,
];
//# sourceMappingURL=order.enum.js.map