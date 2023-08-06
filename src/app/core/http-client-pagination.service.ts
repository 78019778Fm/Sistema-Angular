import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHandler } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Page } from 'src/app/shared/models/page';
import { Pageable } from 'src/app/shared/models/pageable';

/**
 * Servicio que extiendes las capacidades de HttpClient, permitiendo paginaciones y ordenaciones más sencillas.
 *
 * @author Alexander Tutoriales
 */
@Injectable({
  providedIn: 'root'
})
export class HttpClientPaginationService extends HttpClient {

  constructor(handler: HttpHandler) {
    super(handler);
  }

  /**
   * Emite una petición 'GET' a la URL especificada usando un objeto Pageable.
   * Se pueden pasar parámetros HTTP adicionales si fuera necesario.
   *
   * @param url - URL de la API
   * @param pageable - Objeto Pageable con el número de página, su tamaño e información de ordenación.
   * @param additionalHttpParams - Parámetros HTTP opcionales (útil para filtrado)
   *
   * @return un Observable del objeto Page conteniendo los elementos obtenidos por la API.
   */
  getPaginated<T>(url: string, pageable: Pageable, additionalHttpParams?: HttpParams): Observable<Page<T>> {
    let params: HttpParams = additionalHttpParams || new HttpParams();
    const sort = this.getSortParameter(pageable);
    params = params.set('page', pageable.page.toString()).set('size', pageable.size.toString());
    if (sort) {
      params = params.set('sort', sort);
    }
    return this.get<Page<T>>(url, {
      params,
      observe: 'body'
    });
  }

  /**
   * Emite una petición 'POST' a la URL especificada usando un objeto Pageable.
   * Se pueden pasar parámetros HTTP adicionales si fuera necesario.
   *
   * @param url - URL de la API
   * @param pageable - Objeto Pageable con el número de página, su tamaño e información de ordenación.
   * @param body - Cuerpo de la petición. Normalmente será un DTO con campos de filtrado.
   * @param additionalHttpParams - Parámetros HTTP opcionales (útil para filtrado)
   *
   * @return un Observable del objeto Page conteniendo los elementos obtenidos por la API.
   */
  postPaginated<T, U>(url: string, pageable: Pageable, body: U, additionalHttpParams?: HttpParams): Observable<Page<T>> {
    let params: HttpParams = additionalHttpParams || new HttpParams();
    const sort = this.getSortParameter(pageable);
    params = params.set('page', pageable.page.toString()).set('size', pageable.size.toString());
    if (sort) {
      params = params.set('sort', sort);
    }
    return this.post<Page<T>>(url, body, {
      params,
      observe: 'body'
    });
  }

  /**
   * Método privado de apoyo para transformar el lenguaje utilizado por las tablas PrimeNG en parámetros reconocibles por Spring.
   *
   * @param pageable Objeto Pageable con la información de paginación y ordenación.
   *
   * @return Concatenación comprensible para Spring.
   */
  private getSortParameter(pageable: Pageable): string {

    if (pageable.sort) {
      return pageable.sort.concat(',').concat(pageable.direction > 0 ? 'asc' : 'desc');
    }

  }
}
