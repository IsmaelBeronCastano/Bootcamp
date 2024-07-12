import { Controller, Get, Post, Body, Put, Param, Delete, Patch } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { StockDto } from './dto/stock.dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('api/v1/product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiOperation({
    description: "Crea un producto"

  })
  @ApiBody({
    description: "Crea un producto mediante CreateProductDto",
    type: CreateProductDto,
    examples:{
      ejemplo1: {
        value: {
          "id": 2,
          "name": "Producto2",
          "stock":10,
          "price":300
        }
      },
      ejemplo2:{
        value: {
          "name": "Producto2",
          "stock":10,
          "price":300
        }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: "Producto creado correctamente"
  })
  @ApiResponse({
    status:409,
    description: "El producto existe"
  })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findProduct(+id);
  }

  @Put(':id')
  updateProduct(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.updateProduct(+id, updateProductDto);
  }

  @Delete(':id')
  removeProduct(@Param('id') id: string) {
    return this.productService.removeProduct(+id);
  }
  
  @Patch('/stock')
  updateStock(@Body() s: StockDto){
    return this.productService.updateStock(s)
  }

  @Patch('/stock-increment')
  incrementStock(@Body() s: StockDto){
    return this.productService.incrementStock(s)
  }
  @Patch('/stock-decrement')
  decrementStock(@Body() s: StockDto){
    return this.productService.decrementStock(s)
  }

  @Patch('restore/:id')
  restoreProduct(@Param('id') id: string){
    return this.productService.restoreProduct(+id)
  }




}
