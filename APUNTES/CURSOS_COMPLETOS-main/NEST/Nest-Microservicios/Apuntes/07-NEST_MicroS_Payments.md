# NEST MICROSERVICIOS - PAYMENTS

- Primero trabajaré con payments-ms fuera de la red Docker
- Será a través de una petición POST que realizaré la transacción
- Estableceré y configuraré la conexión con Stripe, la secret-key en una variable de entorno que genraré en la web de Stripe y le pasaré a la nueva instancia de Stripe en el servicio tras validarla en el archivo envs.
- Stripe hará lo que tenga que hacer (puede realizar el pago o cancelar) y mediante un webhook lo confirmaré
-----   

## Configuración

- Creo una API (todavía no va a ser un microservice) fuera del Launcher con nest new paymenst-ms
- Borro lo que no necesito
- Creo el archivo de config/envs, requiere dos instalaciones dotenv i joi
- De momento solo condfiguraré el puerto

~~~js
import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  
}

const envsSchema = joi.object({
  PORT: joi.number().required(),

})
.unknown(true);

const { error, value } = envsSchema.validate( process.env );


if ( error ) {
  throw new Error(`Config validation error: ${ error.message }`);
}

const envVars:EnvVars = value;


export const envs = {
  port: envVars.PORT
}
~~~

- En .env

~~~
PORT=3003
~~~

- Creemos un Logger en el main

~~~js
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { envs } from './config/envs';

async function bootstrap() {

  const logger = new Logger('Payments-microservice')


  const app = await NestFactory.create(AppModule);
  await app.listen(envs.port);
  logger.log(`Server running on http://localhost:${envs.port}`)
}
bootstrap();
~~~

- Creo dos métodos en el controlador

~~~js
import { Controller, Get, Post } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-payment-session')
  createPaymentSession(){
    return this.paymentsService.createPaymentSession();
  }

  @Get('success')
  success(){
    return this.paymentsService.success();
  }

  @Get('cancel')
  cancel(){
    return this.paymentsService.cancel();
  }

  @Post('webhool')
  async stripeWebhook(){
    return this.paymentsService.stripeWebhook();
  }
}
~~~
- Instalo el paquete de Stripe con npm i 
- En el servicio creo una nueva instancia de Stripe y declaro los métodos que llamo desde el controlador

~~~js
import { Injectable } from '@nestjs/common';

@Injectable()
export class PaymentsService {
  
  createPaymentSession(): string {
    return 'This action adds a new payment session';
  }

  success(): string {
    return 'This action returns success';
  }

  cancel(): string {
    return 'This action returns cancel';
  }

  stripeWebhook(): string {
    return 'This action returns webhook';
  }

}

~~~
----

## Configuración de Stripe

- Para obtener la secret_key debo poner Stripe en modo Test y acudir al apartado Developer una vez logeado
- Instalo stripe con npm i strip
- Tienes la documentación en stripe docs
- Valido la env STRIPE_SECRET en mi archivo de configuración /config/envs

~~~js
import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  STRIPE_SECRET_KEY: string;
  
}

const envsSchema = joi.object({
  PORT: joi.number().required(),
  STRIPE_SECRET_KEY: joi.string().required(),
})
.unknown(true);

const { error, value } = envsSchema.validate( process.env );


if ( error ) {
  throw new Error(`Config validation error: ${ error.message }`);
}

const envVars:EnvVars = value;


export const envs = {
  port: envVars.PORT,
  stripeSecretKey: envVars.STRIPE_SECRET_KEY
}
~~~

- En payments.service creo la instancia de Stripe con la secret_key de la env

~~~js
import { Injectable } from '@nestjs/common';
import { envs } from 'src/config/envs';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {

  private readonly stripe = new Stripe(envs.stripeSecretKey)
  
  createPaymentSession(): string {
    return 'This action adds a new payment session';
  }

  success(): string {
    return 'This action returns success';
  }

  cancel(): string {
    return 'This action returns cancel';
  }

  stripeWebhook(): string {
    return 'This action returns webhook';
  }

}
~~~
-----

## Crear sesión de pago

- En el método de payments.service createPaymentSession

~~~js
import { Injectable } from '@nestjs/common';
import { envs } from 'src/config/envs';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {

  private readonly stripe = new Stripe(envs.stripeSecretKey)
  
  async createPaymentSession() {
    const session = await this.stripe.checkout.sessions.create({
      //colocar aquí el id de mi order  
      payment_intent_data:{
        metadata:{
          order_id: 'order_123456789'
        }
      },
      //aquí van los items que la gente está comprando
      line_items:[
        {
          price_data:{
            currency: 'eur',
            product_data:{   //product_data es para crear el producto en el momento. product es para referenciar un producto ya creado en Stripe
              name: 'T-shirt'
            },
            unit_amount: 2000 //esto equivale a 20 euros (el precio del producto). No permite decimales como 20.00
          },
          quantity: 2 //20*2 = 40 eur
        }
      ],
      mode:'payment',
      success_url: 'http://localhost:3003/payments/success',
      cancel_url: 'http://localhost:3003/payments/cancel'

     })

     return session
  }


  success(): string {
    return 'This action returns success';
  }

  cancel(): string {
    return 'This action returns cancel';
  }

  stripeWebhook(): string {
    return 'This action returns webhook';
  }

}
~~~

- Si voy al endpoint localhot:3003/payments/create-payment-session con POST obtengo esto

~~~json
{
  "id": "cs_test_a15xIlRB5KXo4TwX0rNjfm6Cw554MK22xFKxSUevuI6sqcZQcSXjq7abu4",
  "object": "checkout.session",
  "after_expiration": null,
  "allow_promotion_codes": null,
  "amount_subtotal": 4000,
  "amount_total": 4000,
  "automatic_tax": {
    "enabled": false,
    "liability": null,
    "status": null
  },
  "billing_address_collection": null,
  "cancel_url": "http://localhost:3003/payments/cancel",
  "client_reference_id": null,
  "client_secret": null,
  "consent": null,
  "consent_collection": null,
  "created": 1715056083,
  "currency": "eur",
  "currency_conversion": null,
  "custom_fields": [],
  "custom_text": {
    "after_submit": null,
    "shipping_address": null,
    "submit": null,
    "terms_of_service_acceptance": null
  },
  "customer": null,
  "customer_creation": "if_required",
  "customer_details": null,
  "customer_email": null,
  "expires_at": 1715142483,
  "invoice": null,
  "invoice_creation": {
    "enabled": false,
    "invoice_data": {
      "account_tax_ids": null,
      "custom_fields": null,
      "description": null,
      "footer": null,
      "issuer": null,
      "metadata": {},
      "rendering_options": null
    }
  },
  "livemode": false,
  "locale": null,
  "metadata": {},
  "mode": "payment",
  "payment_intent": null,
  "payment_link": null,
  "payment_method_collection": "if_required",
  "payment_method_configuration_details": null,
  "payment_method_options": {
    "card": {
      "request_three_d_secure": "automatic"
    }
  },
  "payment_method_types": [
    "card"
  ],
  "payment_status": "unpaid",
  "phone_number_collection": {
    "enabled": false
  },
  "recovered_from": null,
  "saved_payment_method_options": null,
  "setup_intent": null,
  "shipping_address_collection": null,
  "shipping_cost": null,
  "shipping_details": null,
  "shipping_options": [],
  "status": "open",
  "submit_type": null,
  "subscription": null,
  "success_url": "http://localhost:3003/payments/success",
  "total_details": {
    "amount_discount": 0,
    "amount_shipping": 0,
    "amount_tax": 0
  },
  "ui_mode": "hosted",
  "url": "https://checkout.stripe.com/c/pay/cs_test_a15xIlRB5KXo4TwX0rNjfm6Cw554MK22xFKxSUevuI6sqcZQcSXjq7abu4#fidkdWxOYHwnPyd1blpxYHZxWjA0VUFUfHBGcmFNZD1cR2JxV25gNDB8cFFIdjZcbkdLRFJiZHZvUFBdY2l1NDddUFNvTHdkY3RuQj1TSVxUcEZ9NFRGPEY0b11PfT1VVVI3M1RBV25Of2BnNTV3Xz1UcFFzYCcpJ2N3amhWYHdzYHcnP3F3cGApJ2lkfGpwcVF8dWAnPyd2bGtiaWBabHFgaCcpJ2BrZGdpYFVpZGZgbWppYWB3dic%2FcXdwYHgl"
}
~~~

- Si le doy a la url del final me lleva a la pantalla de stripe con la opción de pagar 40 eur y para poner los datos de la tarjeta
- Relleno los datos con datos ficticios (usar 4242 4242 4242 4242 para la tarjeta)
- Una vez hecho el pago me redirecciona al endpoint success y puedo ver el pago desde la web de stripe como pago exitoso
--------

## Payment Session DTO

- En lugar de poner la información en duro, los datos que van en create-payment-session vendrá desde otro microservicio
- Para trabajar con dtos hay queinstalar class-validator class-transformer
- Hay que configurar el globalPipes en el main

~~~js
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs } from './config/envs';

async function bootstrap() {

  const logger = new Logger('Payments-microservice')


  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true
  }))

  await app.listen(envs.port);
  logger.log(`Server running on http://localhost:${envs.port}`)
}
bootstrap();
~~~

- En el dto

~~~js
import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsNumber, IsPositive, IsString, ValidateNested } from "class-validator";

export class PaymentSessionDto {
    
    @IsString()
    currency: string
    
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({each:true})
    @Type(()=>PaymentSessionItemDto) //transformo items en instancias de PaymentSessionItemDto
    items: PaymentSessionItemDto[]
}


export class PaymentSessionItemDto{
    @IsString()
    name: string

    @IsNumber()
    @IsPositive()
    price: number

    @IsNumber()
    @IsPositive()
    quantity: number
}
~~~

- Recojo del Body en el controller y valido con el dto

~~~js
@Post('create-payment-session')
  createPaymentSession(@Body()paymentSessionDto: PaymentSessionDto){
    return this.paymentsService.createPaymentSession(paymentSessionDto);
  }
~~~

- En el servicio recojo el dto
- Debo pasarle al endpoint el objeto que me pide el dto en el body de POSTMAN o similares

~~~json
{
  "currency": "eur",
  "items":[
    {
      "name": "Preservativos",
      "price": 18.03,
      "quantity": 1
    }]
}
~~~

- En el servicio extraemos con desestructuración la data para poder trabajar con ella
- Hago un map de items y cojo el objeto que me pide la documentación y lo reconstruyo con mi data
- Como el precio puede venir en decimales uso Math.round para redondear y le debo añadir 2 ceros para dejarlo en el formato de stripe
- Le paso el lineItems a la session

~~~js
  async createPaymentSession(paymentSessionDto:PaymentSessionDto) {

    const {currency, items} = paymentSessionDto

    const lineItems= items.map(({name, price, quantity})=>{
      return {
        price_data:{
          currency,
          product_data:{   
            name 
          },
          unit_amount: Math.round(price *100)
        },
        quantity
      }
    })

    const session = await this.stripe.checkout.sessions.create({
      //colocar aquí el id de mi order  
      payment_intent_data:{
        metadata:{
          order_id: 'order_123456789'
        }
      },
      //aquí van los items que la gente está comprando
      line_items: lineItems,
      mode:'payment',
      success_url: 'http://localhost:3003/payments/success',
      cancel_url: 'http://localhost:3003/payments/cancel'

     })

     return session
  }
~~~

- Ahora falta configurar el webhook para ser notificados cuando el pago se haya realizado
-------

## Probando webhooks de stripe

- Caundo realizo un pago, Stripe mediante un POST manda a llamar el webhook y lo envia a mi endpoint
- Tengo que controlar que sea stripe, con la firma de stripe
- En la web de Stripe voy a Developers/webhooks (hay muchos!)
- Añadir punto de conexión: podemos probar test in a local environment o directamente con un endpoint
- Para el test in local environment hay que instalar el cliente de stripe (un zip, darle al exe y configrar el path). Se puede hacer a traves de Docker
- Usaré un endpoint real directamente, selecciono los eventos a escuchar
- Al lado derecho tenemos el código a implementar
- Usa express, y nosotros también (debajo de Nest)
- Dice que mandemos el body como un raw y eso puede ser un poco tedioso si queremos crear un middleware, pero Nest facilita mucho la faena
- En el main, en app, coloco el rawBody en true 

~~~js
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs } from './config/envs';

async function bootstrap() {

  const logger = new Logger('Payments-microservice')


  const app = await NestFactory.create(AppModule,{
    rawBody: true //esto va a mandar el body como un buffer que es exactamente lo que me piden
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true
  }))

  await app.listen(envs.port);
  logger.log(`Server running on http://localhost:${envs.port}`)
}
bootstrap();
~~~

- Va a venir la firma en los headers de la petición. Necesito la request

~~~js
stripeWebhook(req: Request, res: Response) {
    const sig = req.headers['stripe-signature'];
    return res.status(200).json({sig})
  }
~~~

- En el controller ocupo tomar la request

~~~js
@Post('webhook')
async stripeWebhook(@Req() req: Request,@Res() res:Response){
  return this.paymentsService.stripeWebhook(req,res);
}
~~~
-------

## Implementar el Webhook

- Si procesamos el Body vamos a tener un error, porque Stripe lo verifica
- Por eso lo tomamos directamente de la Request
- Creo un evento
- Copio el endpointSecret de la documentación
- En un try catch, de la req tomo el rawBody (hay que escribirlo asi), el signature y el endpointSecret

~~~js
  stripeWebhook(req: Request, res: Response) {
    const sig = req.headers['stripe-signature'];


    let event: Stripe.Event
    const endpointSecret = "whsec_c74a813338de786ac11af0b167e3b53e74f63303a960b7cc6adcc5f585cf088d";


    try {
      event = this.stripe.webhooks.constructEvent(req['rawBody'], sig, endpointSecret);
    } catch (err) {
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    return res.status(200).json({sig})
  }
~~~

- Si no hace match con el endpointSecret mandará un error
- Si estoy probandolo localmente y he instalado el cliente puedo usar stripe trigger payment_intent.succeeded
- Esto me devuelve charge.succeded, payment_intent.succeded y payment_intent.created (Stripe primero crea un intento de pago)
- Charge succeded es la confirmación
- Si pruebo el webhook con un aurl, no voy a poder usar localhost
- Vamos a tener que usar un Proxy o algo intermedio
-----

## Hookdeck - EventGateway - Forwarder

- Podemos usar un switch para tomar el tipo de evento que me devuelve el webhook y realizar una acción

~~~js
async stripeWebhook(req: Request, res: Response) {
    const sig = req.headers['stripe-signature'];


    let event: Stripe.Event
    const endpointSecret = "whsec_c74a813338de786ac11af0b167e3b53e74f63303a960b7cc6adcc5f585cf088d";


    try {
      event = this.stripe.webhooks.constructEvent(req['rawBody'], sig, endpointSecret);
    } catch (err) {
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    switch(event.type){
      case 'charge.succeeded':
        //llamar al microservicio
        break;

        default: 
        console.log(`Evento  ${event} not handled`)
    }

    return res.status(200).json({sig})
  }
~~~

- Para obtener la url usaremos hoockdeck
- hay otros: smee (no funciona con stripe porque procesa el body)
- le coloco un nombre cualquiera al endpoint fuente stripe-to-localhost
- Le coloco otronombre cualquiera al endpoint destino to-localhost
- Instalo el CLI

>  npm install hookdeck-cli -g

- En endpoint url coloco el localhost:3003/payments/webhook (solo payments/webhook)
- recibo un url. Lo debo colocar en la parte de Stripe
  
> https://hkdk.events/nan95cp9850tx9

- Ahora solo tengo que usar el CLI

> hookdeck login
> hookdeck listen 3003 stripe-to-localhost

- Si apunto con un POST a http://localhost:3003/payments/webhook  debería darme un error como Webhook Error: No webhook payload was provided.
- Todavía no hemos añadido el string a stripe
- En developers/webhooks/añadir punto de conexión coloco la uRL
- Escucho el evento charge.failed y charge.succeeded
- Añadir evento
- Copio el secreto de firma de la pantalla esperando eventos...  (el de ahora es el real, el anterior era de testing)
- Hago todo el proceso de crear y pagar y me manda a la pantalla de this action returns success que es lo que tengo en el endpoint de success
- Puedo hacer console.logs para chequear eventos y demás
------

## Enviar y recibir la Id de la orden

- Necesito el orderId (UUID) de mi orders-ms
- Puedo grabar el id de la transacción en order, o el URL de receipt_url del recibo (conveniente)
- En PaymentSessionDto creo el orderId como string

~~~js
export class PaymentSessionDto {
    
    @IsString()
    orderId: string

    @IsString()
    currency: string
    
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({each:true})
    @Type(()=>PaymentSessionItemDto)
    items: PaymentSessionItemDto[]
}
~~~

- En el payments.service.create extraigo la orderId con desestructuración
- Lo coloco en la metadata de la session
- Podemos tomar la información del evento en el switch
- **NOTA**: he configurado las variables de entorno

~~~js
import { Injectable } from '@nestjs/common';
import { envs } from 'src/config';
import Stripe from 'stripe';
import { PaymentSessionDto } from './dto/payment-session.dto';
import { Request, Response } from 'express';

@Injectable()
export class PaymentsService {
  private readonly stripe = new Stripe(envs.stripeSecret);

  async createPaymentSession(paymentSessionDto: PaymentSessionDto) {
    const { currency, items, orderId } = paymentSessionDto; /7extraigo la orderId

    const lineItems = items.map((item) => {
      return {
        price_data: {
          currency: currency,
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      };
    });

    const session = await this.stripe.checkout.sessions.create({
      // Colocar aquí el ID de mi orden
      payment_intent_data: {
        metadata: {
          orderId: orderId
        },
      },
      line_items: lineItems,
      mode: 'payment',
      success_url: envs.stripeSuccessUrl,
      cancel_url: envs.stripeCancelUrl,
    });

    return session;
  }

  async stripeWebhook(req: Request, res: Response) {
    const sig = req.headers['stripe-signature'];

    let event: Stripe.Event;

    // Real
    const endpointSecret = envs.stripeEndpointSecret;

    try {
      event = this.stripe.webhooks.constructEvent(
        req['rawBody'],
        sig,
        endpointSecret,
      );
    } catch (err) {
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
    
    switch( event.type ) {
      case 'charge.succeeded': 
        const chargeSucceeded = event.data.object;
        // TODO: llamar nuestro microservicio
        console.log({
          metadata: chargeSucceeded.metadata,
          orderId: chargeSucceeded.metadata.orderId,
        });
      break;
      
      default:
        console.log(`Event ${ event.type } not handled`);
    }

    return res.status(200).json({ sig });
  }
}
~~~

- Ahora debo hacer un pago. Recuerda tener el hoockdeck corriendo en la terminal
- **NOTA**: Estoy teniendo problemas con hookdeck, usaré ngrok
- Abrir cmd como admin

> choco install ngrok

> ngrok http 3003

- En stripe coloco el endpoint con la ruta que me da ngrok

> https://03b6-2-152-179-155.ngrok-free.app/payments/webhook

- En la documentacion dice que debes añadir la clave secreta del webhook que te proporciona stripe con

> ngrok http 8080 --verify-webhook=stripe --verify-webhook-secret=mySecret

- Necesito obtener el UUID de orders-microservices
 
