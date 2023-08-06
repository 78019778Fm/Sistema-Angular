import {Util} from '../../../shared/utils/utils';

/**
 * Representa el formato de respuesta del backend.
 *
 * @author Alexander Tutoriales
 */

export interface GenericResponse<T> {
  type: string;
  rpta: number;
  message: string;
  body: T;
}
export class GenericResponse<T> {
  constructor(parameters?: any) {
    Util.createInstanceWithParameters(this, parameters);
  }

  convertGenericResponse() {
    return {
      type: this.type ? this.type : null,
      rpta: this.rpta ? this.rpta : null,
      message: this.message ? this.message : null,
      body: this.body ? this.body : null
    };
  }
}
