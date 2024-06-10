import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller('/api/v1/order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @Get()
  findAll() {
    return this.orderService.findAll();
  }

  @Get("/pendings")
  getPendingOrders(){
    return this.orderService.getPendingOrders()
  }

  @Get("/confirmed")
  getConfirmedOrders(@Query("start") start: Date, @Query("end") end: Date){
    return this.orderService.getConfirmedOrders(start, end)
  }

  @Get(':id')
  getOrderById(@Param('id') id: string) {
    return this.orderService.getOrderById(id);
  }

  @Get("/client/:clientId")
  getOrdersByClient(@Param("idClient") idClient: string){
    return this.orderService.getOrdersByClient(+idClient)
  }

  @Patch("/confirm/:id")
  confirmOrder(@Param('id') id: string){
    return this.orderService.confirmOrder(id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(+id);
  }
}
