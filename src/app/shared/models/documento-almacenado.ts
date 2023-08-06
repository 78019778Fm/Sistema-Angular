import {Util} from '../../../shared/utils/utils';

export interface DocumentoAlmacenado {
  id?: number;
  nombre: string;
  fileName: string;
  extension: string;
  estado: string;
  eliminado: boolean;
  urlFile: string;
  completeFileName: string;
  // tslint:disable-next-line:no-misused-new
  new (parameters?: any): DocumentoAlmacenado;
}

export class DocumentoAlmacenado {
  constructor(parameters?: any) {
    Util.createInstanceWithParameters(this, parameters);
  }

  convertDocumentoAlmacenado() {
    return {
      id: this.id ? this.id : null,
      nombre: this.nombre ? this.nombre : null,
      fileName: this.fileName ? this.fileName : null,
      extension: this.extension ? this.extension : null,
      estado: this.estado ? this.estado : null,
      eliminado: this.eliminado ? this.eliminado : null,
      urlFile: this.urlFile ? this.urlFile : null,
      completeFileName: this.completeFileName ? this.completeFileName : null
    };

  }
}
