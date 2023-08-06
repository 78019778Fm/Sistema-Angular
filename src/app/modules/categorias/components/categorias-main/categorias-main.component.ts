import {Component, OnInit, ViewChild} from '@angular/core';
import {Categoria} from '../../../../shared/models/categoria';
import {Page} from '../../../../shared/models/page';
import {CategoriasTableComponent} from '../categorias-table/categorias-table.component';
import {Pageable} from '../../../../shared/models/pageable';
import {takeUntil} from 'rxjs/operators';
import {TranslateService} from '@ngx-translate/core';
import {CategoriaService} from '../../services/categoria.service';
import {AbstractComponent} from '../../../../components/shared/abstract.component';
import {CategoriaFilter} from '../../models/categoria-filter';

@Component({
  selector: 'app-categorias-main',
  templateUrl: './categorias-main.component.html',
  styleUrls: ['./categorias-main.component.css']
})
export class CategoriasMainComponent extends AbstractComponent implements OnInit {
  @ViewChild('categoriasTable') categoriasTable: CategoriasTableComponent;
  page: Page<Categoria> = {} as Page<Categoria>;
  registroSeleccionado: Categoria;
  isLoading = true;
  filtro: CategoriaFilter;
  selectedColumnsCategoria: any[];
  colsCategorias: any[];
  displayNuevo = false;
  estadoModal: string;
  textoTituloNuevoEditar: string;
  textoBotonNuevoEditar: string;
  view = false;
  registroCategoria: Categoria;
  selectedFile: File;
  formData = new FormData();

  constructor(protected translateService: TranslateService,
              protected categoriaService: CategoriaService,
  ) {
    super(translateService);
  }

  ngOnInit() {
    this.cargarColumnasCategoria();
    this.initFiltros();
  }

  initFiltros(): void {
    this.filtro = new CategoriaFilter();
  }

  cargarColumnasCategoria() {
    this.selectedColumnsCategoria = this.categoriaService.cargarColumnasCategoria();
    const existeListaCategoria = localStorage.getItem('LISTA_CATEGORIAS');
    if (existeListaCategoria) {
      const data = JSON.parse(localStorage.getItem('LISTA_CATEGORIAS'));
      if (data) {
        this.colsCategorias = data;
      } else {
        this.colsCategorias = this.categoriaService.cargarColumnasCategoria();
      }
    } else {
      this.colsCategorias = this.categoriaService.cargarColumnasCategoria();
    }
  }
  columnaSeleccionada(columns: any) {
    this.colsCategorias = this.categoriaService.cargarColumnasCategoria();
    this.colsCategorias = [];
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < columns.value.length; i++) {
      this.colsCategorias.push(columns.value[i]);
    }
    localStorage.setItem('LISTA_CATEGORIAS', JSON.stringify(this.colsCategorias));
  }

  cargarRegistrosTabla(pageable?: Pageable) {
    this.isLoading = true;
    this.categoriaService.filtrar(pageable, this.filtro)
      .pipe(takeUntil(this.destroy$)).subscribe((categoria: Page<Categoria>) => {
      this.page = categoria;
      this.isLoading = false;
    });
  }

  seleccionarRegistro(categoria: Categoria) {
    this.registroSeleccionado = categoria;
  }

}
