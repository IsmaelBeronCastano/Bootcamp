# 02 NEST REPORTS CONSTANCIA DE EMPLEADOS

- Vamos a crear un reporte con el logo de la compañía, donde empleado tal certifique que trabaja de esto en la compañía con su footer, header..
- Nos haremos una idea de como funciona pdfmake, básicamente es línea por línea
- Cuando hay dos elementos en una linea, entonces separamos por columnas
- Veremos:
  - Estructura del contenido del reporte
  - Crear encabezados y pies de página
  - Trabajar con imágenes desde el backend
  - Formatear fechas
  - Columnas
  - Cragar data en el reporte
  - Estilos personalizados
  - Secciones del reporte de forma reutilizable
  - Crear una constancia laboral
----------

## Continuación

- Con docker compose up -d levanto las imagenes de postgres y pgAdmin
- Si no tuviera la db (sin las carpetas de postgres y pgAdmin) las creará de nuevo
- Ejecuto npx primsa generate
- Ahora ya puedo trabajar con prisma
- Ejecuto npm run start:dev
- Si hago una llamada a un endpoint y tengo un error 500 porque borré la tabla, la carpeta de postgres, ingreso de nuevo en el 8080 y entro en pgAdmin
- Registro un nuevo servidor, en conexiones, el nombre del host es el nombre del container de Docker (postgres_database)
- Puerto 5432, usuario postgres, password 123456
- En Database/ databases/ schemas/ tables 
- Vuelvo a construir la tabla con el query tool, pegando el código entregado actualmente del archivo employees.sql
------

## PdfMake

- Para consultar la documentación, hay varios ejemplos en pdfmake, documentation, Server side, examples

> npm i pdfmake
> npm i -D @types/pdfmake

- Creo la carpeta fonts en la raíz del proyecto y copio todas las fuentes del gist
- Creo un módulo printer dentro de src con su servicio con **nest g mo printer** y **nest g service printer**
- En el módulo de printer exporto el servicio

~~~js
import { Module } from '@nestjs/common';
import { PrinterService } from './printer.service';

@Module({
  providers: [PrinterService],
  exports: [PrinterService],
})
export class PrinterModule {}
~~~

- Me aseguro de que el módulo de Printer esté importado en app.module

~~~js
import { Module } from '@nestjs/common';
import { BasicReportsModule } from './basic-reports/basic-reports.module';
import { PrinterModule } from './printer/printer.module';

@Module({
  imports: [BasicReportsModule, PrinterModule],
})
export class AppModule {}
~~~

- Hago la inyección de las fuentes en la instancia de la impresora en el printer.service
- Uso las interfaces de pdfmake. BufferOptions me servirá para configuraciones posteriores
- PDFKit debería estar de manera global con los @types/pdfmake

~~~js
import { Injectable } from '@nestjs/common';
import PdfPrinter from 'pdfmake';
import { BufferOptions, TDocumentDefinitions } from 'pdfmake/interfaces';

const fonts = {
  Roboto: {
    normal: 'fonts/Roboto-Regular.ttf',
    bold: 'fonts/Roboto-Medium.ttf',
    italics: 'fonts/Roboto-Italic.ttf',
    bolditalics: 'fonts/Roboto-MediumItalic.ttf',
  },
};

@Injectable()
export class PrinterService {
  private printer = new PdfPrinter(fonts); //defino la impresora

  createPdf(
    docDefinition: TDocumentDefinitions,//interfaz de pdfmake
    options: BufferOptions = {}, //interfaz de pdfmake
  ): PDFKit.PDFDocument {
    return this.printer.createPdfKitDocument(docDefinition, options); //uso la impresora pra crear el pdf
  }
}
~~~


- En el basic-reports.controller inyecto el printerService
- Llamo al super porque prisma me lo exije
- En el caso de uso getHelloWorldreport le paso el name y lo guardo en docDefinition
- Uso el método createPdf del servicio de PrinterService y le paso el docdefinition con el name
  - Lo guardo en doc
- Retorno el doc

~~~js
import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrinterService } from 'src/printer/printer.service';
import {
  getEmploymentLetterByIdReport,
  getEmploymentLetterReport,
  getHelloWorldReport,
} from 'src/reports';

@Injectable()
export class BasicReportsService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
    // console.log('Connected to the database');
  }
  constructor(private readonly printerService: PrinterService) {
    super();
  }

  hello() {               //en la carpeta reports está getHelloWorldReport
    const docDefinition = getHelloWorldReport({
      name: 'Fernando Herrera',
    });

    const doc = this.printerService.createPdf(docDefinition); //creo el pdf

    return doc; //retorno el pdf
  }
}
~~~

- **getHelloWorldReport** está en la carpeta src/reports
- Le paso el name en las options (creo una interfaz), devolverá algo de tipo TDocumentdefinitions
- Extraigo el name con desestructuración
- En el objeto introduzco un template stray dentro del array de content y le paso el name
- Retorno el doc
- reports/hello-world.ts

~~~js
import type { TDocumentDefinitions } from 'pdfmake/interfaces';

interface ReportOptions {
  name: string;
}

export const getHelloWorldReport = (
  options: ReportOptions,
): TDocumentDefinitions => {
  const { name } = options;

  const docDefinition: TDocumentDefinitions = {
    content: [`Hola ${name}`],
  };

  return docDefinition;
};
~~~

- Y desde el basic-reports.controller llamo al servicio
- Utilizo **@Res** para obtener la Response y poder setear el content-type y demás
- Guardo el doc que obtengo con el basicReportsService.hello que llama al caso de uso getHelloWorldReport y genera el pdf con el PrinterService
- Con la response seteo el contentType
- Uso el pdf que he obtenido y con .info.Title le pongo un título
- Uso un pipe para enlazar la respuesta con el pdf
- Cierro el pdfDoc
~~~js
import { Controller, Get, Param, Res } from '@nestjs/common';
import { BasicReportsService } from './basic-reports.service';
import { Response } from 'express';

@Controller('basic-reports')
export class BasicReportsController {
  constructor(private readonly basicReportsService: BasicReportsService) {}

  @Get()
  async hello(@Res() response: Response) {
    const pdfDoc = this.basicReportsService.hello();

    response.setHeader('Content-Type', 'application/pdf'); //le digo que el content-type es un pdf
    pdfDoc.info.Title = 'Hola-Mundo.pdf'; //le pongo un título, el .pdf no es necesario
    pdfDoc.pipe(response); //vamos a enlazar la respuesta con el pdf
    pdfDoc.end(); //cerramos
  }
}
~~~

- Para que el pdfmake_1.default is not a constructor no dé problemas, debo colocar en el **tsconfig el esModuleInterop: true**
-----

## Cómo funciona pdfmake

- Cuando observamos un documento hecho con pdfmake (o cualquiera en realidad), podemos analizarlo como un html y dividirlo en lineas horizontales (las verticales vendrán después)
- Tengo el header, el h1 centrado que puede estar dentro de un section, los párrafos que pueden estar en una sola linea y separarlos con /n, un section o un div con el atentamente(1 linea), debajo el nombre del empleador (otra linea) como un arreglo de string con /n para crear una linea debajo de la otra, y un footer
- Podemos crear un sistema de columnas
-------

## Constancia de empleo - Reporte

- Creo la carpeta assets donde guardo las imágenes que usaré para el reporte y tengo el texto que quiero imprimir en el documento
- Empecemos por el controlador, creando employmentLetter
- Es básicamente lo mismo que el ejemplo anterior

~~~js
 @Get('employment-letter')
  async employmentLetter(@Res() response: Response) {
    const pdfDoc = this.basicReportsService.employmentLetter();

    response.setHeader('Content-Type', 'application/pdf');
    pdfDoc.info.Title = 'Employment-Letter';
    pdfDoc.pipe(response);
    pdfDoc.end();
  }
~~~

- En basicreportsService guardo el caso de uso y uso printerService para generar el pdf

~~~js
employmentLetter() {
  const docDefinition = getEmploymentLetterReport();
  const doc = this.printerService.createPdf(docDefinition);
  return doc;
}
~~~

- El caso de uso en src/reports/getemploymentLetterReport
- Creo unos estilos para el header de tipo StyleDictionary de pdfmake
- Al docDefinition de tipo TDocumentDefinitions le paso los estilos en la propiedad styles
  - Le paso los márgenes de la página
  - En el headerSection pongo el showLogo y showdate en true
  - Añado el content que es un arreglo de objetos con las diferentes secciones
  - Le paso el estilo de cada párrafo con la propiedad style
- Retorno el documento

~~~js
import type { StyleDictionary, TDocumentDefinitions } from 'pdfmake/interfaces';
import { headerSection } from './sections/header.section';

const styles: StyleDictionary = {
  header: {
    fontSize: 22,
    bold: true,
    alignment: 'center', //alignment es left por defecto
    margin: [0, 60, 0, 20], //left, top, right, bottom. Añado los margins
  },
  body: {
    alignment: 'justify', 
    margin: [0, 0, 0, 70],
  },
  signature: {
    fontSize: 14,
    bold: true,
    // alignment: 'left',
  },
  footer: {
    fontSize: 10,
    italics: true,
    alignment: 'center',
    margin: [0, 0, 0, 20],
  },
};

export const getEmploymentLetterReport = (): TDocumentDefinitions => {
  const docDefinition: TDocumentDefinitions = {
    styles: styles,
    pageMargins: [40, 60, 40, 60], //creo los márgenes del documento

  //para mostrar el logo y la data
    header: headerSection({
      showLogo: true,
      showDate: true,
    }),

    content: [
      {
        text: 'CONSTANCIA DE EMPLEO',
        style: 'header',
      },
      {
        text: `Yo, [Nombre del Empleador], en mi calidad de [Cargo del Empleador] de [Nombre de la Empresa], por medio de la presente certifico que [Nombre del Empleado] ha sido empleado en nuestra empresa desde el [Fecha de Inicio del Empleado]. \n\n
        Durante su empleo, el Sr./Sra. [Nombre del Empleado] ha desempeñado el cargo de [Cargo del Empleado], demostrando responsabilidad, compromiso y habilidades profesionales en sus labores.\n\n
        La jornada laboral del Sr./ Sra. [Nombre del Empleado] es de [Número de Horas] horas semanales, con un horario de [Horario de Trabajo], cumpliendo con las políticas y procedimientos establecidos por la empresa.\n\n
        Esta constancia se expide a solicitud del interesado para los fines que considere conveniente. \n\n`,
        style: 'body',
      },
      { text: `Atentamente`, style: 'signature' },
      { text: `[Nombre del Empleador] `, style: 'signature' },
      { text: `[Cargo del Empleador]`, style: 'signature' },
      { text: `[Nombre de la Empresa]`, style: 'signature' },
      { text: `[Fecha de Emisión]`, style: 'signature' },
    ],

    footer: {
      text: 'Este documento es una constancia de empleo y no representa un compromiso laboral.',
      style: 'footer',
    },
  };

  return docDefinition;
};
~~~

- En reports/sections/ tengo el header.section para mostarr el logo y la data
- Creo el logo de tipo Content de pdfmake
- En la interfaz HeaderOptions añado las propiedades, todas opcionales
- Le paso las options al método que devolverá algo de tipo Content
- Desestructuro de las options lo que sea que haya y seteo por defecto a true el showLogo y showDate
- Con un ternario evalúo si viene el showLogo en true le paso el logo, si no null
- Guardo en headerDate el showDate también usando un ternario
  - Si viene uso el DateFormatter que he creado para formatear la fecha y añadirlo a la izquierda
- Hago algo parecido guardando el title en headerTitle, pasándole en el texto el title y el estilo
- Regreso en un objeto arreglo de la propiedad columns con las constantes que he creado
- Estas columns crea las columnas en el documento, en este caso 3
- header.section

~~~js
import { Content } from 'pdfmake/interfaces';
import { DateFormatter } from 'src/helpers';

const logo: Content = {
  image: 'src/assets/tucan-code-logo.png',
  width: 100, //le doy un tamaño
  height: 100,
  alignment: 'center', //la coloco en el centro de lo que será la primera columna
  margin: [0, 0, 0, 20],
};

interface HeaderOptions {
  title?: string;
  subTitle?: string;
  showLogo?: boolean;
  showDate?: boolean;
}

export const headerSection = (options: HeaderOptions): Content => {
  const { title, subTitle, showLogo = true, showDate = true } = options;

  const headerLogo: Content = showLogo ? logo : null;
  const headerDate: Content = showDate
    ? {
        text: DateFormatter.getDDMMMMYYYY(new Date()),
        alignment: 'right',
        margin: [20, 20],
      }
    : null;

  const headerTitle: Content = title
    ? {
        text: title,
        style: {
          bold: true,
        },
      }
    : null;

  return {
    columns: [headerLogo, headerTitle, headerDate],
  };
};
~~~

- El dateFormatter lo tengo en src/helpers

~~~js
export class DateFormatter {
  static formatter = new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
  });

  static getDDMMMMYYYY(date: Date): string {
    return this.formatter.format(date);
  }
}
~~~

- Documentación oficial
- https://pdfmake.github.io/docs/0.1/document-definition-object/headers-footers/
-------

## Cargar información del empleado

- En el basics-reports.controller

~~~js
@Get('employment-letter/:employeeId')
async employmentLetterById(
  @Res() response: Response,
  @Param('employeeId') employeeId: string,
) {
  const pdfDoc =
    await this.basicReportsService.employmentLetterById(+employeeId);

  response.setHeader('Content-Type', 'application/pdf');
  pdfDoc.info.Title = 'Employment-Letter';
  pdfDoc.pipe(response);
  pdfDoc.end();
}
~~~

- En el basic-reports.service compruebo que exista el employee
- Genero el empleado con el caso de uso de getEmployementLetterByIdReport

~~~js
async employmentLetterById(employeeId: number) {
  const employee = await this.employees.findUnique({
    where: {
      id: employeeId,
    },
  });

  if (!employee) {
    throw new NotFoundException(`Employee with id ${employeeId} not found`);
  }

  const docDefinition = getEmploymentLetterByIdReport({
    employerName: 'Fernando Herrera',
    employerPosition: 'Gerente de RRHH',
    employeeName: employee.name,
    employeePosition: employee.position,
    employeeStartDate: employee.start_date,
    employeeHours: employee.hours_per_day,
    employeeWorkSchedule: employee.work_schedule,
    employerCompany: 'Tucan Code Corp.',
  });

  const doc = this.printerService.createPdf(docDefinition);

  return doc;
}
~~~

- En reports/emplyment-letter-bi-id.reports creo la interfaz de los parámetros que debo pasarle
- Creo los estilos
- Creo el método, le paso el ReportValues, devuelve algo de tipo TDocumentDefinitions 
- Desestructuro las propiedades
- Creo el docDefinition que es de tipo TDocumentDefinitions y le paso los estilos
- Utilizo la misma plantilla que cree antes y usando el template literal le paso las variables
- le añado los estilos correspondientes a cada objeto que he creado previamente en el StyleDictionary

~~~js
import type { StyleDictionary, TDocumentDefinitions } from 'pdfmake/interfaces';
import { headerSection } from './sections/header.section';
import { DateFormatter } from 'src/helpers';

interface ReportValues {
  employerName: string;
  employerPosition: string;
  employeeName: string;
  employeePosition: string;
  employeeStartDate: Date;
  employeeHours: number;
  employeeWorkSchedule: string;
  employerCompany: string;
}

const styles: StyleDictionary = {
  header: {
    fontSize: 22,
    bold: true,
    alignment: 'center',
    margin: [0, 60, 0, 20],
  },
  body: {
    alignment: 'justify',
    margin: [0, 0, 0, 70],
  },
  signature: {
    fontSize: 14,
    bold: true,
    // alignment: 'left',
  },
  footer: {
    fontSize: 10,
    italics: true,
    alignment: 'center',
    margin: [0, 0, 0, 20],
  },
};

export const getEmploymentLetterByIdReport = (
  values: ReportValues,
): TDocumentDefinitions => {
  const {
    employerName,
    employerPosition,
    employeeName,
    employeePosition,
    employeeStartDate,
    employeeHours,
    employeeWorkSchedule,
    employerCompany,
  } = values;

  const docDefinition: TDocumentDefinitions = {
    styles: styles,
    pageMargins: [40, 60, 40, 60],

    header: headerSection({
      showLogo: true,
      showDate: true,
    }),

    content: [
      {
        text: 'CONSTANCIA DE EMPLEO',
        style: 'header',
      },
      {
        text: `Yo, ${employerName}, en mi calidad de ${employerPosition} de ${employerCompany}, por medio de la presente certifico que ${employeeName} ha sido empleado en nuestra empresa desde el ${DateFormatter.getDDMMMMYYYY(employeeStartDate)}. \n\n
        Durante su empleo, el Sr./Sra. ${employeeName} ha desempeñado el cargo de ${employeePosition}, demostrando responsabilidad, compromiso y habilidades profesionales en sus labores.\n\n
        La jornada laboral del Sr./ Sra. ${employeeName} es de ${employeeHours} horas semanales, con un horario de ${employeeWorkSchedule}, cumpliendo con las políticas y procedimientos establecidos por la empresa.\n\n
        Esta constancia se expide a solicitud del interesado para los fines que considere conveniente. \n\n`,
        style: 'body',
      },
      { text: `Atentamente`, style: 'signature' },
      { text: employerName, style: 'signature' },
      { text: employerPosition, style: 'signature' },
      { text: employerCompany, style: 'signature' },
      { text: DateFormatter.getDDMMMMYYYY(new Date()), style: 'signature' },
    ],

    footer: {
      text: 'Este documento es una constancia de empleo y no representa un compromiso laboral.',
      style: 'footer',
    },
  };

  return docDefinition;
};
~~~