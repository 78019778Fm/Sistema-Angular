import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {Page} from '../../../../shared/models/page';
import {Pageable} from '../../../../shared/models/pageable';
import {Table} from 'primeng-lts/table';
import {LazyLoadEvent} from 'primeng-lts/api';

@Component({
  selector: 'app-categorias-table',
  templateUrl: './categorias-table.component.html',
  styleUrls: ['./categorias-table.component.css']
})
export class CategoriasTableComponent {

  @Input() page: Page<any>;
  @Input() isLoading: boolean;
  rows = 10;
  @Input() colsCategorias: any[];
  @Input() selectedColumnsCategoria: any[];
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onColumnSelect = new EventEmitter<any>();
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onLazyLoad = new EventEmitter<Pageable>();
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onRowSelect = new EventEmitter<any>();

  @ViewChild('table') public table: Table;
  registroSeleccionado: any;
  pageable: Pageable;
  sortField: string;

  constructor() {
  }

  public lazyLoad(event?: LazyLoadEvent): void {

    if (this.sortField && this.sortField !== event.sortField) {
      event.first = 0;
    }
    this.sortField = event.sortField;
    this.onLazyLoad.next(this.getPageableFromLazyLoadEvent(event));
  }

  public rowSelect(event: any): void {
    this.onRowSelect.emit(this.registroSeleccionado);
  }

  public rowUnselect(event: any): void {
    this.onRowSelect.emit(undefined);
  }

  private getPageableFromLazyLoadEvent(event?: LazyLoadEvent): Pageable {

    this.pageable = {
      page: event ? (event.first ? event.first / event.rows : 0) : 0,
      size: event ? (event.rows ? event.rows : this.rows) : this.rows,
      sort: event ? event.sortField : null,
      direction: event ? event.sortOrder : null
    };
    return this.pageable;
  }

  getCantidadColumnasSeleccionadas(): number {
    return this.colsCategorias.length;
  }

  public columnSelect(event: any): void {
    this.onColumnSelect.emit(event);
  }

  getNgStyleWidthHeader(col: any): any {
    switch (col.field) {
      case 'nombre':
        return '150px';
      case 'vigenciaString':
        return '80px';
    }
  }

  getColumns(columns): any {
    return columns;
  }

}
