"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const client_1 = require("@prisma/client");
let ProductsService = class ProductsService extends client_1.PrismaClient {
    constructor() {
        super(...arguments);
        this.logger = new common_1.Logger('ProductsService');
    }
    onModuleInit() {
        this.$connect();
        this.logger.log('Database connected');
    }
    create(createProductDto) {
        return this.product.create({
            data: createProductDto,
        });
    }
    async findAll(paginationDto) {
        const { page, limit } = paginationDto;
        const totalPages = await this.product.count({ where: { available: true } });
        const lastPage = Math.ceil(totalPages / limit);
        return {
            data: await this.product.findMany({
                skip: (page - 1) * limit,
                take: limit,
                where: {
                    available: true,
                },
            }),
            meta: {
                total: totalPages,
                page: page,
                lastPage: lastPage,
            },
        };
    }
    async findOne(id) {
        const product = await this.product.findFirst({
            where: { id, available: true },
        });
        if (!product) {
            throw new microservices_1.RpcException({
                message: `Product with id #${id} not found`,
                status: common_1.HttpStatus.BAD_REQUEST,
            });
        }
        return product;
    }
    async update(id, updateProductDto) {
        const { id: __, ...data } = updateProductDto;
        await this.findOne(id);
        return this.product.update({
            where: { id },
            data: data,
        });
    }
    async remove(id) {
        await this.findOne(id);
        const product = await this.product.update({
            where: { id },
            data: {
                available: false,
            },
        });
        return product;
    }
    async validateProducts(ids) {
        ids = Array.from(new Set(ids));
        const products = await this.product.findMany({
            where: {
                id: {
                    in: ids
                }
            }
        });
        if (products.length !== ids.length) {
            throw new microservices_1.RpcException({
                message: 'Some products were not found',
                status: common_1.HttpStatus.BAD_REQUEST,
            });
        }
        return products;
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)()
], ProductsService);
//# sourceMappingURL=products.service.js.map