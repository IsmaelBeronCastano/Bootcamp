# 04 NEST REPORTS - MAESTRO DETALLE

- Veremos
  - Código QR
  - Inner joins
  - Tablas y estilos
  - Estructura y alineamiento
  - Envío de datos de Prisma a reporte
-----

## 

- Necesitamos establecer una relación entre ORDER_DETAILS PRODUCTS y COSTUMERS
- Creo el módulo de satoreReports con **nest g resource storeReports --no-spec**
- Necesito el prinerModule para usar el servicio de la impresora
  - El servicio ya está excportado de PrinterModule, importo el módulo en StoreReportsModule

~~~js
import { Module } from '@nestjs/common';
import { StoreReportsService } from './store-reports.service';
import { StoreReportsController } from './store-reports.controller';
import { PrinterModule } from 'src/printer/printer.module';

@Module({
  controllers: [StoreReportsController],
  providers: [StoreReportsService],
  imports: [PrinterModule],
})
export class StoreReportsModule {}
~~~

- En el StorereportsController hago lo mismo que en el caso anterior
  - Tomo la Response con @Res
  - Pido el id por @Params
  - En el servicio inyecto el PrinterService, creo el doc
  - Seteo los headers
  - Enlazo la response con el doc usando pipe
  - Cierro la conexión

~~~js
import { Controller, Get, Param, Res } from '@nestjs/common';
import { StoreReportsService } from './store-reports.service';
import { Response } from 'express';

@Controller('store-reports')
export class StoreReportsController {
  constructor(private readonly storeReportsService: StoreReportsService) {}

  @Get('orders/:orderId')
  async getOrderReport(
    @Res() response: Response,
    @Param('orderId') orderId: string,
  ) {
    const pdfDoc = await this.storeReportsService.getOrderByIdReport(+orderId);

    response.setHeader('Content-Type', 'application/pdf');
    pdfDoc.info.Title = 'Order-Report';
    pdfDoc.pipe(response);
    pdfDoc.end();
  }
}
~~~

- En StoreReportsService busco por id con prisma, incluyo el campo costumers y el campo products
- Debo crear estas tablas y estas relaciones primero 
- **NOTA**: CÓDIGO SPOILER!! Todavía no se han hecho estas tablas ni las relaciones

~~~js
import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrinterService } from 'src/printer/printer.service';
import { orderByIdReport } from 'src/reports';

@Injectable()
export class StoreReportsService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
    // console.log('Connected to the database');
  }

  constructor(private readonly printerService: PrinterService) {
    super(); //usando primsa tengo que llamar al constructor padre
  }

  async getOrderByIdReport(orderId: number) {
    const order = await this.orders.findUnique({
      where: {
        order_id: orderId,
      },
      include: {
        customers: true,
        order_details: {
          include: {
            products: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with id ${orderId} not found`);
    }

    const docDefinition = orderByIdReport({
      data: order as any,
    });

    const doc = this.printerService.createPdf(docDefinition);

    return doc;
  }
}
~~~
----

## Creación del reporte

- En src/reports/orderById.reports.ts creo varias interfaces
- Piensa en la composición del documento como filas horizontales (y verticales, si delimitas columnas)

~~~js
import type {
  Content,
  StyleDictionary,
  TDocumentDefinitions,
} from 'pdfmake/interfaces';
import { CurrencyFormatter, DateFormatter } from 'src/helpers';
import { footerSection } from './sections/footer.section';

const logo: Content = {
  image: 'src/assets/tucan-banner.png',
  width: 100,
  height: 30,
  margin: [10, 30],
};

const styles: StyleDictionary = {
  header: {
    fontSize: 20,
    bold: true,
    margin: [0, 30, 0, 0],
  },
  subHeader: {
    fontSize: 16,
    bold: true,
    margin: [0, 20, 0, 0],
  },
};

// esta interfaz sale de Paste JSON as Code con el resultado de un objeto vacío del método serializado con JSON.stringify
export interface CompleteOrder {
  order_id: number;
  customer_id: number;
  order_date: Date;
  customers: Customers;
  order_details: OrderDetail[];
}

export interface Customers {
  customer_id: number;
  customer_name: string;
  contact_name: string;
  address: string;
  city: string;
  postal_code: string;
  country: string;
}

export interface OrderDetail {
  order_detail_id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  products: Products;
}

export interface Products {
  product_id: number;
  product_name: string;
  category_id: number;
  unit: string;
  price: string;
}

interface ReportValues {
  title?: string;
  subTitle?: string;
  data: CompleteOrder; //para sacar esta interfaz he ejecutado order= orderByIdReport({}) con un objeto vacío
                      //y he hecho un console.log(JSON.stringify(order, null, 2)) que me da un JSON válido
                      //copio la respuesta a Paste JSON as Code para que me de las interfaces
}

export const orderByIdReport = (value: ReportValues): TDocumentDefinitions => {
  const { data } = value;

  const { customers, order_details } = data;

//uso un reduce para obtener el total
  const subTotal = order_details.reduce(
    (acc, detail) => acc + detail.quantity * +detail.products.price,
    0,
  );

  const total = subTotal * 1.15; //Le sumo el 15% de IVA

  return {
    styles: styles,
    header: logo,
    pageMargins: [40, 60, 40, 60],
    footer: footerSection,
    content: [
      // Headers
      {
        text: 'Tucan Code',
        style: 'header',
      },

      // Address y número recibo
      {
        columns: [
          {
            text: '15 Montgomery Str, Suite 100, \nOttawa ON K2Y 9X1, CANADA\nBN: 12783671823\nhttps://devtalles.com',
          },
          { //para aplicar estilos en la misma linea puedo encerrar el texto entre corchetes y aplicar style:, o bold:true
            text: [
              {
                text: `Recibo No. ${data.order_id}\n`,
                bold: true,
              },
              `Fecha del recibo ${DateFormatter.getDDMMMMYYYY(data.order_date)}\nPagar antes de: ${DateFormatter.getDDMMMMYYYY(new Date())}\n`,
            ],
            alignment: 'right',
          },
        ],
      },

      // QR   CON SOLO ESTO YA CREO EL QR, fit para el tamaño
      { qr: 'https://devtalles.com', fit: 75, alignment: 'right' },

      // Dirección del cliente
      {
        text: [
          {
            text: 'Cobrar a: \n',
            style: 'subHeader',
          },
          `Razón Social: ${customers.customer_name},
          Contacto: ${customers.contact_name}`,
        ],
      },

      // Table del detalle de la orden
      {
        layout: 'headerLineOnly',
        margin: [0, 20],
        table: {
          headerRows: 1,
          widths: [50, '*', 'auto', 'auto', 'auto'], //5 columnas
          body: [
            ['ID', 'Descripción', 'Cantidad', 'Precio', 'Total'], //Las 5 columnas

            ...order_details.map((detail) => [
              detail.order_detail_id.toString(),
              detail.products.product_name,
              detail.quantity.toString(),
              {
                text: CurrencyFormatter.formatCurrency(+detail.products.price),
                alignment: 'right',
              },
              {
                text: CurrencyFormatter.formatCurrency(
                  +detail.products.price * detail.quantity,
                ),
                alignment: 'right',
              },
            ]),
          ],
        },
      },

      // Salto de línea
      '\n',

      // Totales
      {
        columns: [
          {
            width: '*',
            text: '',
          },
          {
            width: 'auto',
            layout: 'noBorders',
            table: {
              body: [
                [
                  'Subtotal',
                  {
                    text: CurrencyFormatter.formatCurrency(subTotal),
                    alignment: 'right',
                  },
                ],
                [
                  { text: 'Total', bold: true },
                  {
                    text: CurrencyFormatter.formatCurrency(total),
                    alignment: 'right',
                    bold: true,
                  },
                ],
              ],
            },
          },
        ],
      },
    ],
  };
};
~~~

- En el schema puedo crear los modelos manualmente o hacerlo con un pull después de crear las tablas en un query

~~~js
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model employees {
  id            Int      @id @default(autoincrement())
  name          String   @db.VarChar(100)
  position      String   @db.VarChar(50)
  start_date    DateTime @db.Date
  work_time     DateTime @db.Time(6)
  hours_per_day Int
  work_schedule String   @db.VarChar(50)
}

/// This model or at least one of its fields has comments in the database, and requires an additional setup for migrations: Read more: https://pris.ly/d/database-comments
model countries {
  id         BigInt      @id @default(autoincrement())
  name       String?
  iso2       String
  iso3       String?
  local_name String?
  continent  continents?
}

model categories {
  category_id   Int        @id @default(autoincrement())
  category_name String?    @db.VarChar(255)
  description   String?    @db.VarChar(255)
  products      products[]
}

model customers {
  customer_id   Int      @id @default(autoincrement())
  customer_name String?  @db.VarChar(255)
  contact_name  String?  @db.VarChar(255)
  address       String?  @db.VarChar(255)
  city          String?  @db.VarChar(255)
  postal_code   String?  @db.VarChar(255)
  country       String?  @db.VarChar(255)
  orders        orders[]
}

model order_details {
  order_detail_id Int       @id @default(autoincrement())
  order_id        Int?
  product_id      Int?
  quantity        Int?
  orders          orders?   @relation(fields: [order_id], references: [order_id], onDelete: NoAction, onUpdate: NoAction)
  products        products? @relation(fields: [product_id], references: [product_id], onDelete: NoAction, onUpdate: NoAction)
}

model orders {
  order_id      Int             @id @default(autoincrement())
  customer_id   Int?
  order_date    DateTime?       @db.Date
  order_details order_details[]
  customers     customers?      @relation(fields: [customer_id], references: [customer_id], onDelete: NoAction, onUpdate: NoAction)
}

model products {
  product_id    Int             @id @default(autoincrement())
  product_name  String?         @db.VarChar(255)
  category_id   Int?
  unit          String?         @db.VarChar(255)
  price         Decimal?        @db.Decimal(10, 2)
  order_details order_details[]
  categories    categories?     @relation(fields: [category_id], references: [category_id], onDelete: NoAction, onUpdate: NoAction)
}

enum continents {
  Africa
  Antarctica
  Asia
  Europe
  Oceania
  North_America @map("North America")
  South_America @map("South America")
}
~~~
----

## Código QR

- Crear el código QR es sencillo
- Tan fácil como escribir

~~~js
const docDefinition={
  content:[
    {qr: "Texto dentro del qr"}
  ]
  
}
~~~
## Relaciones de las tablas

- Cómo sería la relación para la orden 10250
~~~
SELECT
*
FROM
    ORDERS
    INNER JOIN  ORDER_DETAILS ON ORDERS.ORDER_ID = ORDER_DETAILS.ORDER.ID
WHERE
    ORDERS.ORDER_id = 10250    
~~~

- DE ESTA MANERA SABEMOS CUANTOS PRODUCTOS SE LLEVA PERO NO TENEMOS LA INFO DEL PRODUCTO

~~~
SELECT
*
FROM
    ORDERS
    INNER JOIN  ORDER_DETAILS ON ORDERS.ORDER_ID = ORDER_DETAILS.ORDER.ID
    INNER JOIN products on  ORDER_DETAILS.product_id = products.product_id 
WHERE
    ORDERS.ORDER_id = 10250
~~~

- De esta manera ya tenemos el nombre del producto, la categoría, el precio...
- Necesitamos otro INNER JOIN para el cliente

~~~
SELECT
*
FROM
    ORDERS
    INNER JOIN  ORDER_DETAILS ON ORDERS.ORDER_ID = ORDER_DETAILS.ORDER.ID
    INNER JOIN products on  ORDER_DETAILS.product_id = products.product_id 
    INNER JOIN customers on orders.customer.id = customers.customer_id
WHERE
    ORDERS.ORDER_id = 10250
~~~


