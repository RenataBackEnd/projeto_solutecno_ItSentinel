import { Component, ElementRef, effect, inject, viewChild } from '@angular/core';
import { ConfirmacaoService } from '../../services/confirmacao';
import { Icone } from '../icone/icone';

@Component({
  selector: 'app-dialogo-confirmacao',
  standalone: true,
  imports: [Icone],
  template: `
    <dialog #dialogo aria-labelledby="titulo-confirmacao" aria-describedby="texto-confirmacao"
            (cancel)="$event.preventDefault(); servico.responder(false)"
            (click)="clicouFora($event)">
      @if (servico.pedido(); as p) {
        <div class="conteudo">
          <span class="icone" [class.perigo]="p.perigo"><app-icone [nome]="p.icone || 'info'" [tamanho]="24" /></span>
          <h2 id="titulo-confirmacao">{{ p.titulo }}</h2>
          <p id="texto-confirmacao">{{ p.mensagem }}</p>
          <div class="acoes">
            <button type="button" class="btn btn-fantasma" (click)="servico.responder(false)" autofocus>{{ p.cancelar || 'Cancelar' }}</button>
            <button type="button" class="btn" [class.btn-perigo]="p.perigo" [class.btn-primario]="!p.perigo" (click)="servico.responder(true)">{{ p.confirmar }}</button>
          </div>
        </div>
      }
    </dialog>`,
  styles: `
    dialog {
      width: min(26rem, calc(100vw - 2rem)); padding: 0; margin: auto;
      border: 1px solid var(--cor-borda); border-radius: var(--raio-lg);
      background: var(--cor-superficie); color: var(--cor-texto); box-shadow: var(--sombra-lg);
    }
    dialog[open] { animation: surgir 180ms cubic-bezier(.2,.8,.2,1); }
    dialog::backdrop { background: rgba(8, 16, 12, .55); backdrop-filter: blur(2px); }
    .conteudo { padding: 1.75rem; text-align: center; }
    .icone { display: inline-flex; padding: .75rem; margin-bottom: 1rem; border-radius: 50%; background: var(--cor-primaria-suave); color: var(--cor-primaria); }
    .icone.perigo { background: var(--cor-erro-fundo); color: var(--cor-erro); }
    h2 { font-size: 1.25rem; margin-bottom: .5rem; }
    p { color: var(--cor-texto-suave); font-size: .9375rem; line-height: 1.5; }
    .acoes { display: flex; gap: .75rem; margin-top: 1.5rem; }
    .acoes .btn { flex: 1; }
    .btn-perigo { background: var(--cor-erro); color: #fff; }
    :root[data-theme="dark"] .btn-perigo { color: #1a0d0d; }
    .btn-perigo:hover { filter: brightness(.92); }
    @keyframes surgir { from { opacity: 0; transform: translateY(.5rem) scale(.97); } }
  `,
})
export class DialogoConfirmacao {
  protected servico = inject(ConfirmacaoService);
  private dialogo = viewChild.required<ElementRef<HTMLDialogElement>>('dialogo');
  private focoAnterior: HTMLElement | null = null;

  constructor() {
    effect(() => {
      const aberto = !!this.servico.pedido();
      const el = this.dialogo().nativeElement;
      if (aberto && !el.open) {
        this.focoAnterior = document.activeElement as HTMLElement;
        el.showModal();
      } else if (!aberto && el.open) {
        el.close();
        this.focoAnterior?.focus?.();
      }
    });
  }

  clicouFora(e: MouseEvent) {
    if (e.target === this.dialogo().nativeElement) this.servico.responder(false);
  }
}
