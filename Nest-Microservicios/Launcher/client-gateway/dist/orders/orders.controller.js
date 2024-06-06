"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersController = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("../config");
const microservices_1 = require("@nestjs/microservices");
const dto_1 = require("./dto");
const rxjs_1 = require("rxjs");
const common_2 = require("../common");
let OrdersController = class OrdersController {
    constructor(client) {
        this.client = client;
    }
    create(createOrderDto) {
        return this.client.send('createOrder', createOrderDto);
    }
    findAll(orderPaginationDto) {
        return this.client.send('findAllOrders', orderPaginationDto);
    }
    async findOne(id) {
        try {
            const order = await (0, rxjs_1.firstValueFrom)(this.client.send('findOneOrder', { id }));
            return order;
        }
        catch (error) {
            throw new microservices_1.RpcException(error);
        }
    }
    async findAllByStatus(statusDto, paginationDto) {
        try {
            return this.client.send('findAllOrders', {
                ...paginationDto,
                status: statusDto.status,
            });
        }
        catch (error) {
            throw new microservices_1.RpcException(error);
        }
    }
    changeStatus(id, statusDto) {
        try {
            return this.client.send('changeOrderStatus', { id, status: statusDto.status });
        }
        catch (error) {
            throw new microservices_1.RpcException(error);
        }
    }
};
exports.OrdersController = OrdersController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateOrderDto]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.OrderPaginationDto]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('id/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':status'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.StatusDto,
        common_2.PaginationDto]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "findAllByStatus", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.StatusDto]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "changeStatus", null);
exports.OrdersController = OrdersController = __decorate([
    (0, common_1.Controller)('orders'),
    __param(0, (0, common_1.Inject)(config_1.NATS_SERVICE)),
    __metadata("design:paramtypes", [microservices_1.ClientProxy])
], OrdersController);
//# sourceMappingURL=orders.controller.js.map