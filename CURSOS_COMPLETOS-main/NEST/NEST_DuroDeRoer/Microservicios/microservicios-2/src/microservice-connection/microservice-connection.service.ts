import { Injectable } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';

@Injectable()
export class MicroserviceConnectionService {
    private client: ClientProxy

    constructor(){
        this.client = ClientProxyFactory.create({
            transport: Transport.TCP,
            options:{
                host: '0.0.0.0',
                port: 3032
            }
        })
    }

    getClient(){
        return this.client
    }
}

