import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    create(createProductDto: CreateProductDto): import(".prisma/client").Prisma.Prisma__ProductClient<{
        id: number;
        name: string;
        price: number;
        available: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findAll(paginationDto: PaginationDto): Promise<{
        data: {
            id: number;
            name: string;
            price: number;
            available: boolean;
            createdAt: Date;
            updatedAt: Date;
        }[];
        meta: {
            total: number;
            page: number;
            lastPage: number;
        };
    }>;
    findOne(id: number): Promise<{
        id: number;
        name: string;
        price: number;
        available: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(updateProductDto: UpdateProductDto): Promise<{
        id: number;
        name: string;
        price: number;
        available: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: number): Promise<{
        id: number;
        name: string;
        price: number;
        available: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    validateProduct(ids: number[]): Promise<{
        id: number;
        name: string;
        price: number;
        available: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
}
