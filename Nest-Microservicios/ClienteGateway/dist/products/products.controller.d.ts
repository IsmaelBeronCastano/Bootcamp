import { ClientProxy } from '@nestjs/microservices';
import { PaginationDto } from 'src/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductsController {
    private readonly client;
    constructor(client: ClientProxy);
    createProduct(createProductDto: CreateProductDto): import("rxjs").Observable<any>;
    findAllProducts(paginationDto: PaginationDto): import("rxjs").Observable<any>;
    findOne(id: string): Promise<import("rxjs").Observable<any>>;
    deleteProduct(id: string): import("rxjs").Observable<any>;
    patchProduct(id: number, updateProductDto: UpdateProductDto): import("rxjs").Observable<any>;
}
