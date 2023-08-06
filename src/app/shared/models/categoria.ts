import {DocumentoAlmacenado} from './documento-almacenado';
import {Util} from '../../../shared/utils/utils';

export interface Categoria {
  id?: number;
  nombre: string;
  vigencia: boolean;
  vigenciaString: string;
  foto: DocumentoAlmacenado;
  // tslint:disable-next-line:no-misused-new
  new (parameters?: any): Categoria;
}

export class Categoria {
  constructor(parameters?: any) {
    Util.createInstanceWithParameters(this, parameters);
  }

  convertCategoria() {
    return {
      id: this.id ? this.id : null,
      nombre: this.nombre ? this.nombre : null,
      vigencia: this.vigencia ? this.vigencia : null,
      vigenciaString: this.vigenciaString ? this.vigenciaString : null,
      foto: this.foto ? this.foto : null
    };
  }
}
