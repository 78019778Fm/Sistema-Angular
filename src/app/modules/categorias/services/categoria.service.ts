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
import {map, tap} from 'rxjs/operators';
import {GenericResponse} from '../../../shared/models/generic-response';
import {DocumentoAlmacenado} from '../../../shared/models/documento-almacenado';
import {HttpHeaders} from '@angular/common/http';

@Injectable()
export class CategoriaService extends AbstractService {

  private endpoint: string = environment.apiUrl + AppConstants.CATEGORIA_MAIN;
  private endpointDA: string = environment.apiUrl + AppConstants.DOCUMENTO_ALMACENADO;

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

  create(categoria: Categoria): Observable<any> {
    categoria = categoria.convertCategoria() as unknown as Categoria;
    return this.http.post(this.endpoint, categoria);
  }

  guardarImagen(formData: FormData): Observable<GenericResponse<DocumentoAlmacenado>> {
    const headers = new HttpHeaders();
    headers.append('Accept', 'application/json');
    return this.http.post<GenericResponse<DocumentoAlmacenado>>(this.endpointDA, formData, {headers}).pipe(
      map(response => new GenericResponse(response)));
  }

  actualizarImagen(id: number, formData: FormData): Observable<GenericResponse<DocumentoAlmacenado>> {
    const headers = new HttpHeaders();
    headers.append('Accept', 'application/json');
    return this.http.put<GenericResponse<DocumentoAlmacenado>>(`${this.endpointDA}/editImage/${id}`, formData, {headers}).pipe(
      map(response => new GenericResponse(response)));
  }

  getCategoriaById(id: number): Observable<Categoria> {
    return this.http.get(`${this.endpoint}/getById/${id}`).pipe(
      map(response => new Categoria(response))
    );
  }

   getImagenUrl(fileName: string): string {
    const baseUrl = `${this.endpointDA}/download/`;
    const uniqueTimestamp = new Date().getTime(); // Valor de tiempo actual como número único
    return `${baseUrl}${fileName}?timestamp=${uniqueTimestamp}`;
  }

  update(categoria: Categoria): Observable<any> {
    categoria = categoria.convertCategoria() as unknown as Categoria;
    return this.http.put(`${this.endpoint}/${categoria.id}`, categoria);
  }

  delete(categoriaId: number): Observable<any> {
    return this.http.delete(`${this.endpoint}/deleteCategoria/${categoriaId}`);
  }

  deleteImage(id: number): Observable<GenericResponse<any>> {
    return this.http.delete(`${this.endpointDA}/deleteImage/${id}`)
      .pipe(tap((response: any) => new GenericResponse(response)));
  }
}
