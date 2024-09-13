import React from 'react'
import { CategoryRepositoryImpl } from '../../../Data/repositories/CategoryRepository'
import { Category } from '../../entities/Category';
import * as ImagePicker from 'expo-image-picker';
const { update } = new CategoryRepositoryImpl();

export const UpdateCategoryUseCase = async (category: Category) => {
  return await update(category);
}
