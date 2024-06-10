import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ClientService } from 'src/client/client.service';
import { ProductService } from 'src/product/product.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { IsNull, LessThanOrEqual, MoreThanOrEqual, Not, Repository, UpdateResult } from 'typeorm';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common/exceptions';

@Injectable()
export class OrderService {

  constructor(

    @InjectRepository(Order)
    private orderRepository: Repository<Order>,

    private clientService: ClientService,
    private productService: ProductService,

  ){}

  async create(order: CreateOrderDto) {

    const client = await this.clientService.getClient(order.client.id)
    if(!client){
      throw new NotFoundException("El cliente no existe")
    }

    for(let p of order.products){
      const product = await this.productService.findProduct(p.id)
      if(!product){
        throw new NotFoundException("El producto no existe")
      }else if(product.deleted){
        throw new BadRequestException(`No hay existencias del producto con id ${p.id}`)
      }
    }

    return this.orderRepository.save(order)

  }

  findAll() {
    return `This action returns all order`;
  }

  async getOrderById(id: string) {
    const order= await this.orderRepository.findOne({
      where: {id}
    })
    if(!order){
      throw new BadRequestException("La orden no existe")
    }
    return order
  }

  async getPendingOrders(){
    return await this.orderRepository.find({
      where: {
        confirmAt: IsNull()
      }
    })
  }

  async getConfirmedOrders(start:Date, end: Date){
    if(!isNaN(start.getTime()) || !isNaN(end.getTime())){
      const query = this.orderRepository.createQueryBuilder("order")
                    .leftJoinAndSelect("order.client", "client")
                    .leftJoinAndSelect("order.products", "product")
                    .orderBy("order.confirmAt")
      if(!isNaN(start.getTime())){
          query.andWhere({confirmAt: MoreThanOrEqual(start)})
      }
      if(!isNaN(end.getTime())){
        end.setHours(24)
        end.setMinutes(59)
        end.setSeconds(59)
        query.andWhere({confirmAt: LessThanOrEqual(end)})
      }
      return await query.getMany()

    }else{
      return await this.orderRepository.find({
        where:{
          confirmAt: Not(IsNull())
        },
        order:{
          confirmAt: 'DESC'
        }
      })      
    }


  }

  async confirmOrder(id: string){
    const orderExists = await this.getOrderById(id)

    if(!orderExists){
      throw new NotFoundException("La orden no ha sido encontrada")
    }

    if(orderExists.confirmAt){
      throw new ConflictException("La orden ya está confirmada")
    }
    const rows: UpdateResult = await this.orderRepository.update(
      {id},
      {confirmAt: new Date()}
    )

    return rows.affected ==1
  }

  async getOrdersByClient(idClient: number){
      return this.orderRepository.createQueryBuilder("order")
              .leftJoinAndSelect("order.client", "client")
              .leftJoinAndSelect("order.product", "product")
              .where("client.id = :idClient", {idClient})
              .orderBy("order.confirmAt")
              .getMany()

  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
