import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository, UpdateResult } from 'typeorm';
import { StockDto } from './dto/stock.dto';

@Injectable()
export class ProductService {

  private MIN_STOCK: number = 0
  private MAX_STOCK: number = 1000


  constructor(
    @InjectRepository(Product)
    private  productRepository :Repository<Product> ){
  }

  async create(product: CreateProductDto) {

    const productExists: CreateProductDto= await this.findProduct(product.id)

    if(productExists){
      throw new ConflictException(`El producto con el id ${product.id} ya existe`)
    }

    return await this.productRepository.save(product)
  }

  findAll() {
    return this.productRepository.find({
      where: {deleted: false}
    });
  }

  async findProduct(id: number) {
    return await  this.productRepository.findOne({
      where: {id}
    });
  }

  async updateProduct(id: number, updateProductDto: UpdateProductDto) {
   return await this.productRepository.save(updateProductDto)
  }

  async removeProduct(id: number) {

    const product: CreateProductDto= await this.findProduct(id)

    if(!product){
      throw new ConflictException(`El producto con el id ${id} no existe`)
    }

    if(product.deleted){
      throw new ConflictException(`El producto con id ${id} ya está borrado`)
    }
   
   const rows: UpdateResult= await this.productRepository.update(
      {id}, //los productos que tengan este id ponles eel deleted en true
      {deleted: true}
    )

    return rows.affected == 1 //devolverá un true en caso de borrado exitoso

  }

  async restoreProduct(id: number){
    const product: CreateProductDto= await this.findProduct(id)

    if(!product){
      throw new ConflictException(`El producto con el id ${id} no existe`)
    }

    if(!product.deleted){
      throw new ConflictException(`El producto con id ${id} no está borrado`)
    }

    const rows: UpdateResult= await this.productRepository.update(
      {id}, 
      {deleted: false}
    )

    return rows.affected == 1 
  }

  async updateStock(s: StockDto){
    const product: UpdateProductDto = await this.findProduct(s.id)

    if(!product){
      throw new BadRequestException(`El producto con id ${s.id} no existe`)
    }
    
    if(product.deleted){
      throw new ConflictException("El producto no está disponible")
    }

    const rows: UpdateResult = await this.productRepository.update(
      {id: s.id},
      {stock: s.stock}
    )

    return rows.affected == 1
  }

  async incrementStock(s: StockDto){
    const product: UpdateProductDto = await this.findProduct(s.id)

    if(!product){
      throw new BadRequestException(`El producto con id ${s.id} no existe`)
    }
    
    if(product.deleted){
      throw new ConflictException("El producto no está disponible")
    }

    let stock = 0
    if(s.stock + product.stock > this.MAX_STOCK ){
      throw new ConflictException("El stock excede el máximo permitido")
    }else{
      stock = product.stock + s.stock
    }

    const rows: UpdateResult = await this.productRepository.update(
      {id: s.id},
      {stock}
      
    )

    return rows.affected == 1
  }

  async decrementStock(s: StockDto){
    const product: UpdateProductDto = await this.findProduct(s.id)

    if(!product){
      throw new BadRequestException(`El producto con id ${s.id} no existe`)
    }
    
    if(product.deleted){
      throw new ConflictException("El producto no está disponible")
    }

    let stock = 0
    if(product.stock- s.stock  < this.MIN_STOCK ){
      product.stock = this.MIN_STOCK
    }else{
      stock = product.stock - s.stock
    }

    const rows: UpdateResult = await this.productRepository.update(
      {id: s.id},
      {stock}
      
    )

    return rows.affected == 1
  }
}
