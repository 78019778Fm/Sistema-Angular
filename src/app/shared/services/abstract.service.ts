import { Injectable } from '@angular/core';
import {Page} from 'src/app/shared/models/page';
import {GenericResponse} from '../models/generic-response';

/**
 * Servicio abstracto con métodos globalmente utilizados por otros servicios.
 *
 * @author Alexander Tutoriales
 */
@Injectable()
export abstract class AbstractService {

  /**
   * Array version. Ejecuta el constructor pasado como parámetro en todos los elementos del array.
   *
   * @param object Array de objetos a tratar
   * @param constructor Constructor a ejecutar
   */
  protected gestionarArray<T>(array: T[], constructor: { new(parameters?: any): T; }): T[] {

    if (array) {
      array.map((object) => new constructor(object));
    }

    return array;
  }

  /**
   * Page version. Ejecuta el constructor pasado como parámetro en todos los elementos del array.
   *
   * @param object Page de objetos a tratar
   * @param constructor Constructor a ejecutar
   */
  protected gestionarPage<T>(page: Page<T>, constructor: { new(parameters?: any): T; }): Page<T> {

    if (page) {
      page.content = this.gestionarArray(page.content, constructor);
    }

    return page;
  }

}
