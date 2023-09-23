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
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Message} from 'primeng-lts/api';
import {GenericResponse} from '../../../../shared/models/generic-response';
import {DocumentoAlmacenado} from '../../../../shared/models/documento-almacenado';

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
  nuevaCategoriaForm: FormGroup = this.fb.group({
    id: ['', ''],
    nombre: ['', Validators.required],
    vigencia: ['', '']
  });
  registroCategoria: Categoria;
  selectedFile: File;
  formData = new FormData();
  errores: Message[];
  constructor(protected translateService: TranslateService,
              protected categoriaService: CategoriaService,
              protected fb: FormBuilder
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

  nuevoRegistro() {
    this.displayNuevo = true;
    this.cambioTextModal('N');
    this.nuevaCategoriaForm.reset();
    this.nuevaCategoriaForm.get('vigencia').setValue(true);
  }

  cambioTextModal(tipo: string) {
    this.estadoModal = tipo;
    if (tipo === 'N') {
      this.textoTituloNuevoEditar = this.translateService.instant('CATEGORIAS.DETAIL.TITULO_CREATE');
      this.textoBotonNuevoEditar = this.translateService.instant('CATEGORIAS.DETAIL.CREAR_CATEGORIA');
    } else if (tipo === 'E') {
      this.textoTituloNuevoEditar = this.translateService.instant('CATEGORIAS.DETAIL.TITULO_UPDATE');
      this.textoBotonNuevoEditar = this.translateService.instant('CATEGORIAS.DETAIL.EDITAR_CATEGORIA');
    } else {
      this.textoTituloNuevoEditar = this.translateService.instant('CATEGORIAS.DETAIL.TITULO_VER');
    }
  }
  guardarDatosImagen() {
    let rellenado = false;
    if (this.selectedFile) {
      rellenado = true;
      this.formData.delete('nombre');
      this.formData.delete('file');
      this.formData.append('nombre', this.getFileNameWithoutExtension(this.selectedFile.name));
      this.formData.append('file', this.selectedFile);
    }
    return rellenado;
  }

  private getFileNameWithoutExtension(fileName: string): string {
    return fileName.split('.')[0];
  }

  createUpdateRegistro() {
    this.gestionarReactiveFormToDto();
    const rellenado = this.guardarDatosImagen();
    if (this.estadoModal === 'N') {
      if (!rellenado) {
        this.errores = [{
          severity: 'error',
          summary: this.translateService.instant('CATEGORIAS.MENSAJE_SISTEMA'),
          detail: this.translateService.instant('CATEGORIAS.ERRORES.IMAGEN_NO_RELLENADA')
        }];
        return true;
      }
      this.categoriaService.guardarImagen(this.formData).subscribe((response: GenericResponse<DocumentoAlmacenado>) => {
        this.registroCategoria.foto = response.body;
        this.crearCategoria();
      }, error => {
        console.log('Error al enviar la imagen', error);
      });
    }
  }

  private gestionarReactiveFormToDto() {
    this.registroCategoria = new Categoria(this.nuevaCategoriaForm.value);
  }

  crearCategoria() {
    this.categoriaService.create(this.registroCategoria).pipe(takeUntil(this.destroy$)).subscribe((e) => {
      this.registroCategoria.id = e;
      this.finalizarOperacion();
    });
  }

  finalizarOperacion() {
    this.registroCategoria = new Categoria();
    this.displayNuevo = false;
    this.actualizarRegistroTabla();
  }

  actualizarRegistroTabla() {
    this.categoriasTable.table.clearState();
    this.categoriasTable.table.reset();
    this.registroSeleccionado = null;
  }

  cerrarPopUp() {

  }

  onFileSelect(event: any) {
    this.selectedFile = event.files[0];
    console.log('Archivo seleccionado', this.selectedFile);
  }
}
