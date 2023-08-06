import {Util} from '../../../../shared/utils/utils';

export interface CategoriaFilter {
  nombre: string;
  verInactivos: string;
  // tslint:disable-next-line:no-misused-new
  new (parameters?: any): CategoriaFilter;
}
export class CategoriaFilter {
  constructor(parameters?: any) {
    if (parameters) {
      Util.createInstanceWithParameters(this, parameters);
    }
  }

  convertCategoriaFilter() {
    return {
      nombre: this.nombre ? this.nombre : null,
      verInactivos: this.verInactivos ? this.verInactivos : null
    };
  }
}
