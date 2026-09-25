import { Component, computed, inject } from '@angular/core';
import { PreferenciasService } from '../../services/preferencias';
import { Icone } from '../icone/icone';

/**
 * Barra de acessibilidade única, usada em todas as páginas:
 * A+ / A− (tamanho da fonte), Tema claro/escuro e Libras.
 */
@Component({
  selector: 'app-barra-acessibilidade',
  standalone: true,
  imports: [Icone],
  template: `
    <div class="barra" role="group" aria-label="Opções de acessibilidade">
      <button type="button" class="btn-icone" (click)="aumentar()"
              [disabled]="prefs.nivelFonte() >= prefs.NIVEL_MAXIMO"
              aria-label="Aumentar tamanho do texto" title="Aumentar texto">
        <span aria-hidden="true" class="letra">A+</span>
      </button>
      <button type="button" class="btn-icone" (click)="diminuir()"
              [disabled]="prefs.nivelFonte() === 0"
              aria-label="Diminuir tamanho do texto" title="Diminuir texto">
        <span aria-hidden="true" class="letra">A−</span>
      </button>
      <button type="button" class="btn-icone" (click)="prefs.alternarTema()"
              [attr.aria-pressed]="escuro()"
              [attr.aria-label]="escuro() ? 'Ativar modo claro' : 'Ativar modo escuro'"
              [title]="escuro() ? 'Modo claro' : 'Modo escuro'">
        <app-icone [nome]="escuro() ? 'sol' : 'lua'" [tamanho]="18" />
      </button>
      <a class="btn-icone" href="https://www.gov.br/governodigital/pt-br/vlibras" target="_blank" rel="noopener noreferrer"
         aria-label="Libras: tradutor VLibras (abre em nova aba)" title="Libras (VLibras)">
        <app-icone nome="mao" [tamanho]="18" />
      </a>
    </div>`,
  styles: `
    .barra { display: flex; align-items: center; gap: .375rem; }
    .btn-icone { width: 2.5rem; height: 2.5rem; }
    .btn-icone:disabled { opacity: .45; cursor: not-allowed; }
    .letra { font-size: .8125rem; font-weight: 800; letter-spacing: -.02em; }
  `,
})
export class BarraAcessibilidade {
  protected prefs = inject(PreferenciasService);
  escuro = computed(() => this.prefs.tema() === 'dark');

  aumentar() {
    this.prefs.aumentarFonte();
  }

  diminuir() {
    this.prefs.diminuirFonte();
  }
}
