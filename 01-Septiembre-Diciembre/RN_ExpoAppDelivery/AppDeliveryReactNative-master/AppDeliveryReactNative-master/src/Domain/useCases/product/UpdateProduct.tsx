import { ProductRepositoryImpl } from "../../../Data/repositories/ProductRepository";
import React from 'react'
import { Product } from '../../entities/Product';

const { update } = new ProductRepositoryImpl();

export const UpdateProductUseCase = async (product: Product) => {
  return await update(product);
}
