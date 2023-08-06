/**
 * DTO para la gestión de la paginación y la ordenación en tablas.
 *
 * @author Alexander Tutoriales
 */
export interface Pageable {

  /** Número de página */
  page: number;

  /** Tamaño de página */
  size: number;

  /** Campo por el cual se ordena */
  sort?: string;

  /** Ascendente o descendente */
  direction?: number; // 1 asc, -1 desc
}
