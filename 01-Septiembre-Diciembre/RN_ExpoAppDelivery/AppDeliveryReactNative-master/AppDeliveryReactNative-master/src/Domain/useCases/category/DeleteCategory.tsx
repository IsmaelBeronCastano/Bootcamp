import React from 'react'
import { CategoryRepositoryImpl } from '../../../Data/repositories/CategoryRepository'
import { Category } from '../../entities/Category';
import * as ImagePicker from 'expo-image-picker';
const { remove } = new CategoryRepositoryImpl();

export const DeleteCategoryUseCase = async (id: string) => {
  return await remove(id);
}
