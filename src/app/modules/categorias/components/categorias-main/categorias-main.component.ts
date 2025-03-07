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
import {ConfirmationService, Message} from 'primeng-lts/api';
import {GenericResponse} from '../../../../shared/models/generic-response';
import {DocumentoAlmacenado} from '../../../../shared/models/documento-almacenado';
import {FileUpload} from 'primeng-lts/fileupload';

@Component({
  selector: 'app-categorias-main',
  templateUrl: './categorias-main.component.html',
  styleUrls: ['./categorias-main.component.css']
})
export class CategoriasMainComponent extends AbstractComponent implements OnInit {
  @ViewChild('categoriasTable') categoriasTable: CategoriasTableComponent;
  @ViewChild('fileUpload') fileUpload: FileUpload;
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
  imagenUrl: string;
  disabledComponent = false;
  errores: Message[];

  constructor(protected translateService: TranslateService,
              protected categoriaService: CategoriaService,
              protected fb: FormBuilder,
              protected confirmationService: ConfirmationService
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
    } else {
      if (rellenado) {
        this.categoriaService.actualizarImagen(this.registroSeleccionado.foto.id, this.formData)
          .subscribe((response: GenericResponse<DocumentoAlmacenado>) => {
            this.registroCategoria.foto = response.body;
            this.actualizarCategoria();
          }, (error) => {
            console.log('Error al enviar la imagen', error);
          });
      } else {
        this.registroCategoria.foto = this.registroSeleccionado.foto;
        this.actualizarCategoria();
        console.log('Falta implementar la actualización solo de los datos de la categoria');
      }
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

  actualizarCategoria() {
    this.registroCategoria.id = this.registroSeleccionado.id;
    this.categoriaService.update(this.registroCategoria).pipe(takeUntil(this.destroy$)).subscribe((e) => {
      this.finalizarOperacion();
    });
  }

  finalizarOperacion() {
    this.registroCategoria = new Categoria();
    this.cleanFilesFromForm();
    this.displayNuevo = false;
    this.actualizarRegistroTabla();
  }

  actualizarRegistroTabla() {
    this.categoriasTable.table.clearState();
    this.categoriasTable.table.reset();
    this.registroSeleccionado = null;
  }

  cerrarPopUp() {
    this.displayNuevo = false;
    this.view = false;
    this.nuevaCategoriaForm.reset();
    this.imagenUrl = null;
    this.disabledComponent = false;
    this.cleanFilesFromForm();
    this.errores = [];
  }

  cleanFilesFromForm() {
    this.selectedFile = null;
    this.fileUpload.clear();
  }

  onFileSelect(event: any) {
    this.selectedFile = event.files[0];
    console.log('Archivo seleccionado', this.selectedFile);
    this.imagenUrl = null;
  }

  editarRegistro() {
    this.displayNuevo = true;
    this.cambioTextModal('E');
    this.categoriaService.getCategoriaById(this.registroSeleccionado.id).pipe(takeUntil(this.destroy$))
      .subscribe((categoria: Categoria) => {
        this.registroCategoria = categoria;
        this.gestionarDtoToReactiveForm();
      });
  }

  private gestionarDtoToReactiveForm() {
    this.nuevaCategoriaForm.patchValue(this.registroCategoria);
    this.imagenUrl = this.categoriaService.getImagenUrl(this.registroCategoria.foto.completeFileName);
  }


  confirmarEliminarRegistro() {

    this.confirmationService.confirm({
      message: this.translateService.instant('CATEGORIAS.DETAIL.ALERTA_ELIMINAR'),
      header: this.translateService.instant('CATEGORIAS.DETAIL.ELIMINAR_CATEGORIA'),
      icon: 'pi pi-info-circle',
      accept: () => {
        this.categoriaService.delete(this.registroSeleccionado.id).pipe(takeUntil(this.destroy$))
          .subscribe(() => {
            this.categoriaService.deleteImage(this.registroSeleccionado.foto.id).pipe(takeUntil(this.destroy$))
              .subscribe((response: GenericResponse<any>) => {
                if (response.rpta === 1) {
                  this.actualizarRegistroTabla();
                }
              });
          });
      },
      reject: () => {
        console.log('Ocurrio un error durante la eliminación');
      }
    });
  }
}
