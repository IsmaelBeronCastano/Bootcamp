import { ShoppingBagRepositoryImpl } from "../../../Data/repositories/ShoppingBagRepository";
import React from 'react'
import { Product } from '../../entities/Product';

const { getShoppingBag } = new ShoppingBagRepositoryImpl();


export const GetShoppingBagUseCase = async () => {
  return await getShoppingBag();
}
