import { SelectItem } from 'primeng-lts/primeng';
import { formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

/**
 * Utilidades generales para la aplicación.
 *
 * @author Alexander Tutoriales
 */
export class Util {

  /**
   * Método de apoyo para los constructores. Genera nuevos objetos Date si los campos tienen formato fecha.
   * @param target Objeto destino DTO
   * @param parameters JSON
   */
  public static createInstanceWithParameters(target: any, parameters: any): any {

    if (parameters) {

      Object.assign(target, parameters);

      Object.keys(target).forEach((fieldName: string) => {

        if (parameters.fieldName && typeof parameters.fieldName === 'string') {
          const splitDate = parameters.fieldName.split('/');
          if (splitDate.length === 3) {
            target[fieldName] = new Date(Number(splitDate[2]), Number(splitDate[1]), Number(splitDate[0]));
          }
        }
      });
    }

    return target;
  }

  // Función que realiza el tratamiento de datos de un modelo para adaptarlo al modelo que espera recibir un combo.
  public static getModelSelectItemDropDown(modelo: any, nombreLabel: string, nombreValue: string, opcionVacia: boolean): SelectItem[] {
    let arrayElem: SelectItem[] = [];
    const labels: string[] = nombreLabel.split('-');

    arrayElem = [];
    if (opcionVacia) {
      arrayElem.push({ label: undefined, value: null });
    }

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < modelo.length; i++) {
      if (labels.length > 1) {
        arrayElem.push({ label: (modelo[i][labels[0]] + ' - ' + modelo[i][labels[1]]), value: modelo[i][nombreValue] });
      } else {
        arrayElem.push({ label: modelo[i][nombreLabel], value: modelo[i][nombreValue] });
      }
    }

    return arrayElem;
  }

  // Función que descarga un documento pásandole el nombre al archivo, la extensión y los datos (blob)
  // Añade también la fecha (día y hora) de la descarga
  public static downloadField(nombreArchivo: string, extension: string, data: any): void {
    const downloadURL = window.URL.createObjectURL(data);
    const link = document.createElement('a');
    link.href = downloadURL;
    const myDate = formatDate(new Date(), 'dd-MM-yyyy_HH-mm-ss', 'en');
    link.download = nombreArchivo + '_' + myDate + '.' + extension;
    link.setAttribute('type', 'hidden');
    document.body.appendChild(link);
    if (navigator.appVersion.toString().indexOf('.NET') > 0) {
      window.navigator.msSaveBlob(data, nombreArchivo + '_' + myDate + '.' + extension);
    } else {
      link.click();
      link.remove();
    }
  }

  public static checkMessageError409(message: string, error: HttpErrorResponse) {
    if (error.url.includes('ayuda-publica/exportar')) {
      message = 'AYUDA_PUBLICA.ALERT_EXPORTAR.ERROR_GENERAR';
    }

    return message;
  }

  public static forzarPositivo(event: any) {
    let input = event.target.value;
    if (input) {
      input = input.replaceAll('-', '');
    }
    return input;
  }

  public static validarExpReg(event: any, permitirNegativo: boolean, numEntero: string, numDecimal: string) {
    let input = event.target.value;
    if (input.includes('€') || input.includes(' ') || input.includes('%')) {
      input = input.replaceAll('.', '');
      input = input.replaceAll('€', '');
      input = input.replaceAll('%', '');
      input = input.replace(/\s/g, '');
    }
    input = input.replace(',', '.');
    let point = '^-?\\d{0,XXX}(\\.\\d{0,YYY})?$';
    point = point.replace('XXX', numEntero);
    point = point.replace('YYY', numDecimal);
    let comma = '^-?\\d{0,XXX}(\\,\\d{0,YYY})?$';
    comma = comma.replace('XXX', numEntero);
    comma = comma.replace('YYY', numDecimal);
    let numeroEntero = Number(numEntero);
    const regPoint = new RegExp(point, '');
    const regComma = new RegExp(comma, '');
    if (!regPoint.test(input) && !regComma.test(input)) {
      if (!permitirNegativo) {
        input = input.replaceAll('-', '');
      } else if (input.startsWith('-')) {
        numeroEntero = numeroEntero + 1;
      }
      const splitted = input.split('.');
      const part1 = splitted[0].slice(0, numeroEntero);
      let part2 = '';
      if (splitted[1]) {
        part2 = splitted[1].slice(0, numDecimal);
      }
      let numberInString = part1;
      if (part2 !== '') {
        numberInString += '.' + part2;
      }
      input = Number(numberInString);
    } else {
      if (input && !permitirNegativo) {
        input = input.replaceAll('-', '');
      }
    }
    return input;
  }

}
