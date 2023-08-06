import {AbstractService} from '../../../shared/services/abstract.service';
import {Injectable} from '@angular/core';
import {HttpClientPaginationService} from '../../../core/http-client-pagination.service';
import {TranslateService} from '@ngx-translate/core';
import {environment} from '../../../../environments/environment';
import {AppConstants} from '../../../../shared/utils/app.constants';
import {Pageable} from '../../../shared/models/pageable';
import {CategoriaFilter} from '../models/categoria-filter';
import {Observable} from 'rxjs';
import {Page} from '../../../shared/models/page';
import {Categoria} from '../../../shared/models/categoria';
import {map} from 'rxjs/operators';

@Injectable()
export class CategoriaService extends AbstractService {

  private endpoint: string = environment.apiUrl + AppConstants.CATEGORIA_MAIN;
  constructor(private http: HttpClientPaginationService, private translateService: TranslateService) {
    super();
  }

  public cargarColumnasCategoria(): any[] {
    let res: any [];
    res = [
      {id: 'nombre', field: 'nombre', header: this.translateService.instant('CATEGORIAS.TABLA.CATEGORIA')},
      {id: 'vigenciaString', field: 'vigenciaString', header: this.translateService.instant('CATEGORIAS.TABLA.VIGENCIA')}
    ];
    return res;
  }

  filtrar(page: Pageable, filtroCategoria: CategoriaFilter): Observable<Page<Categoria>> {
    filtroCategoria = filtroCategoria.convertCategoriaFilter() as unknown as CategoriaFilter;
    return this.http.postPaginated<Categoria, CategoriaFilter>(this.endpoint + '/filtrar', page, filtroCategoria)
      .pipe(map((response: Page<Categoria>) => this.gestionarPage<Categoria>(response, Categoria)));
  }
}
