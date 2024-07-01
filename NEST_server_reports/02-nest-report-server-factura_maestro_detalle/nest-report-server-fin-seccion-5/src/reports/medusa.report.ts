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
    fontSize: 26,
    bold: true,
    alignment: 'center',
    margin: [10, 40, 0, 20],
  },
  body: {
    alignment: 'justify',
    margin: [0, 0, 0, 70],
  },
  signature: {
    fontSize: 20,
    bold: false,
    alignment: 'left',
    margin:[0,20,0,50]
  },
  footer: {
    fontSize: 10,
    italics: true,
    alignment: 'center',
    margin: [0, 10, 0, 20],
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
    pageMargins: [0, 60, 40, 60],

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
        Durante su estadía en la empresa, el Sr./Sra. ${employeeName} ha desempeñado el cargo de ${employeePosition}, demostrando responsabilidad, compromiso, eficiencia y habilidades profesionales más que óptimas en el desempeño de sus labores.\n\n
        La jornada laboral del Sr./ Sra. ${employeeName} es de ${employeeHours} horas al día, con un horario de ${employeeWorkSchedule}, cumpliendo con las políticas y procedimientos establecidos por la empresa, así como la normativa vigente.\n\n
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
      text: 'Este documento es una constancia de mi desempeño en la empresa en el último año.',
      style: 'footer',
    },
  };

  return docDefinition;
};
