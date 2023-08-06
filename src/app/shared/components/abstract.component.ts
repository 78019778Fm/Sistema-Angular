import { OnDestroy, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';

/**
 * Componente abstracto para manejar el comportamiento genérico de todos los componentes que la extienden.
 *
 * @author Alexander Tutoriales
 */
@Injectable()
export abstract class AbstractComponent implements OnDestroy {

  protected destroy$: Subject<boolean> = new Subject<boolean>();
  /**
   * Creates an instance of abstract component.
   * @param translateService Servicio de traducción
   */
  constructor(protected translateService: TranslateService) {
    this.subscribeToLanguageChanges();
  }

  /**
   * This method can be overridden if a component needs to do something when the language is changed
   */
  protected onLanguageChanged(langChangeEvent?: LangChangeEvent): void { }

  /**
   * Cuando el componente es destruido, este método desuscribe de todas sus suscripciones.
   * Para que funcione correctamente, todas estas suscripciones deben estar con "takeUntil".
   */
  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  /**
   * Subscribes to language changes.
   * When the language is changed, it executes the empty method onLanguageChanged from this class
   * or the onLanguageChanged method from the component which extends this class
   */
  private subscribeToLanguageChanges(): void {
    this.translateService.onLangChange.pipe(takeUntil(this.destroy$)).subscribe((langChangeEvent: LangChangeEvent) => {
      this.onLanguageChanged(langChangeEvent);
    });
  }
  protected guardarEstadoFiltros(filtro: any): void {
    localStorage.setItem('form-data', JSON.stringify(filtro));
  }

  protected recuperarEstadoFiltros(): any {

    const json = JSON.parse(localStorage.getItem('form-data'));

    if (json) {
      for (const key of Object.keys(json)) {
        if (typeof json[key] === 'string' && json[key].endsWith('000Z')) {
          json[key] = new Date(json[key]);
        }
      }
    }

    return json;
  }

  protected guardarEstadoFiltrosByPantalla(pantalla: any, filtro: any): void {
    localStorage.setItem('form-data-' + pantalla, JSON.stringify(filtro));
  }

  protected recuperarEstadoFiltrosByPantalla(pantalla: any): any {
    const json = JSON.parse(localStorage.getItem('form-data-' + pantalla));
    if (json) {
      for (const key of Object.keys(json)) {
        if (typeof json[key] === 'string' && json[key].endsWith('000Z')) {
          json[key] = new Date(json[key]);
        }
      }
    }
    return json;
  }

  /**
   *
   * @param numeroFiltrar
   * Se utilizara para filtrar los numeros en caso de que el usuario ponga puntos, y para tener en cuenta los numeros decimales
   */
  protected procesarCampoNumerico(numeroFiltrar) {

    if (numeroFiltrar) {
      // quita los espacios en blanco de la cadena numeroFiltrar
      numeroFiltrar = numeroFiltrar.trim();

      // variable donde vamos a ir guardando los caracteres correctos en cada momento
      let cadena = '';
      // donde se va a encontrar la ultima coma que el usuario haya puesto en la cadena numeroFiltrar
      let posicionUltimaComa = 0;
      // donde se va a encontrar el ultimo punto que el usuario haya puesto en la cadena numeroFiltrar
      let posicionUltimoPunto = 0;

      // Recorremos el bucle desde el primer caracter hasta el ultimo
      for (let i = 0; i < numeroFiltrar.length; i++) {
        if (numeroFiltrar.charAt(i) === ',') {
          // nos quedamos con la ultima posicion de la coma
          posicionUltimaComa = i;
        }
        if (numeroFiltrar.charAt(i) !== '.') {
          // junto la cadena siempre que sea diferente a un punto
          cadena += numeroFiltrar.charAt(i);
        }
        if (numeroFiltrar.charAt(i) === '.') {
          /*cuando sea igual que el punto lo sustituyo por una coma excepto cuando le queden 4 iteraciones al bucle que querra decir
          que corresponde a un numero milenial */
          if (i + 4 !== numeroFiltrar.length) {
            cadena += ',';
          }
          posicionUltimoPunto = i;

        }
      }
      // Me quedo con el ultimo valor seleccionado en el caso de que el punto sea el que mas lejos se haya quedado en el recorrido del bucle
      if (posicionUltimaComa < posicionUltimoPunto && numeroFiltrar.length - posicionUltimoPunto !== 2) {
        posicionUltimaComa = posicionUltimoPunto;
      }
      // Guardo la cadena solo con comas ya no tengo puntos y limpio la cadena
      numeroFiltrar = cadena;
      cadena = '';

      for (let i = 0; i < numeroFiltrar.length; i++) {
        // Guardamos la cadena  final sin comas excepto cuando se encuentre la coma necesaria.
        if (numeroFiltrar.charAt(i) !== ',' || posicionUltimaComa === i) {
          cadena += numeroFiltrar.charAt(i);
        }
      }
      // Limpiamos la variable
      numeroFiltrar = ' ';
      // Guardamos la cadena bien formada en la variable numero Filter que es el que devolvemos como resultado
      numeroFiltrar = cadena.toString();
    }

    return numeroFiltrar;
  }
}
