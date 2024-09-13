import { ShoppingBagRepositoryImpl } from "../../../Data/repositories/ShoppingBagRepository";

const { save } = new ShoppingBagRepositoryImpl();

import React from 'react'
import { Product } from '../../entities/Product';

export const SaveShoppingBagUseCase = async (products: Product[]) => {
  return await save(products);
}
