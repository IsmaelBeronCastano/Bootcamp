import { winstonLogger } from "@users/helpers/logger";
import { IProduct } from "../interfaces/IProduct.interface";
import { ProductModel } from "../models/product.model";
import { Logger } from "winston";


const log: Logger = winstonLogger('products service', 'debug');

export async function createProductService ({name, price, quantity, avaliable, creator}: IProduct){
    try {
        ProductModel.create({
            name,
            price,
            quantity,
            avaliable,
            creator
        })
        log.log("Product created", "created OK!")
    } catch (error) {
        log.log("Error creating product", error)
    }
}