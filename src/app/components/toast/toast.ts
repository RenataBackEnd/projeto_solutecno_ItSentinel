import { Component, inject, OnDestroy } from '@angular/core';
import { Toast, ToastService } from '../../services/toast';
import { Icone } from '../icone/icone';

const ICONE_POR_TIPO = { sucesso: 'check-circulo', erro: 'erro', alerta: 'alerta', info: 'info' } as const;

/**
 * Contêiner global de notificações pop-up.
 * - Erros usam role="alert" (lidos imediatamente pelo leitor de tela);
 *   os demais, role="status".
 * - Fecham sozinhos, pausam com o mouse/foco em cima e podem ser
 *   fechados com clique ou tecla Esc.
 */
@Component({
  selector: 'app-toasts',
  standalone: true,
  imports: [Icone],
  template: `
    <div class="pilha" aria-live="polite">
      @for (t of servico.toasts(); track t.id) {
        <div [class]="'toast toast-' + t.tipo"
             [attr.role]="t.tipo === 'erro' ? 'alert' : null"
             (mouseenter)="pausar(t)" (mouseleave)="retomar(t)"
             (focusin)="pausar(t)" (focusout)="retomar(t)"
             (keydown.escape)="fechar(t)"
             (click)="fechar(t)">
          <span class="icone"><app-icone [nome]="icone(t)" [tamanho]="22" /></span>
          <div class="texto">
            <strong>{{ t.titulo }}</strong>
            @if (t.mensagem) { <p>{{ t.mensagem }}</p> }
          </div>
          <button type="button" class="fechar" (click)="fechar(t); $event.stopPropagation()" aria-label="Fechar aviso">
            <app-icone nome="x" [tamanho]="18" />
          </button>
          <span class="barra" [style.animation-duration.ms]="t.duracao" [class.pausada]="pausados.has(t.id)" (animationend)="fechar(t)"></span>
        </div>
      }
    </div>`,
  styles: `
    .pilha {
      position: fixed; top: 5.5rem; right: 1.25rem; z-index: 10001;
      display: flex; flex-direction: column; gap: .75rem;
      width: min(24rem, calc(100vw - 2rem));
      pointer-events: none;
    }
    /* Com a gaveta lateral do Dashboard aberta, os avisos ficam à esquerda dela */
    :host-context(body.gaveta-aberta) .pilha { right: calc(min(26.25rem, 100vw) + 1.25rem); }
    .toast {
      position: relative; overflow: hidden;
      display: flex; align-items: flex-start; gap: .75rem;
      padding: 1rem 2.75rem 1.125rem 1rem;
      border: 1px solid var(--cor-borda);
      border-left: 4px solid var(--cor-tipo);
      border-radius: var(--raio-md);
      background: var(--cor-superficie);
      color: var(--cor-texto);
      box-shadow: var(--sombra-lg);
      pointer-events: auto; cursor: pointer;
      animation: entrar 220ms cubic-bezier(.2,.8,.2,1);
    }
    .toast-sucesso { --cor-tipo: var(--cor-sucesso); --cor-tipo-fundo: var(--cor-sucesso-fundo); }
    .toast-erro    { --cor-tipo: var(--cor-erro);    --cor-tipo-fundo: var(--cor-erro-fundo); }
    .toast-alerta  { --cor-tipo: var(--cor-alerta);  --cor-tipo-fundo: var(--cor-alerta-fundo); }
    .toast-info    { --cor-tipo: var(--cor-info);    --cor-tipo-fundo: var(--cor-info-fundo); }
    .icone {
      display: inline-flex; padding: .375rem; border-radius: 50%;
      color: var(--cor-tipo); background: var(--cor-tipo-fundo);
    }
    .texto { flex: 1; min-width: 0; padding-top: .125rem; }
    strong { display: block; font-size: .9375rem; color: var(--cor-texto); }
    p { margin-top: .25rem; font-size: .875rem; line-height: 1.45; color: var(--cor-texto-suave); }
    .fechar {
      position: absolute; top: .5rem; right: .5rem;
      display: inline-flex; align-items: center; justify-content: center;
      width: 2rem; height: 2rem; border: 0; border-radius: 50%;
      background: transparent; color: var(--cor-texto-suave);
    }
    .fechar:hover { background: var(--cor-superficie-2); color: var(--cor-texto); }
    .barra {
      position: absolute; left: 0; bottom: 0; height: 3px; width: 100%;
      background: var(--cor-tipo); opacity: .6; transform-origin: left;
      animation: tempo linear forwards;
    }
    .barra.pausada { animation-play-state: paused; }
    @keyframes tempo { from { transform: scaleX(1); } to { transform: scaleX(0); } }
    @keyframes entrar { from { opacity: 0; transform: translateX(1rem); } }
    @media (max-width: 600px) {
      .pilha, :host-context(body.gaveta-aberta) .pilha { top: .75rem; right: 50%; transform: translateX(50%); }
    }
    @media (prefers-reduced-motion: reduce) {
      /* Sem animação, o aviso fica até o usuário fechar */
      .barra { display: none; }
    }
  `,
})
export class Toasts implements OnDestroy {
  protected servico = inject(ToastService);
  protected pausados = new Set<number>();

  icone(t: Toast) { return ICONE_POR_TIPO[t.tipo]; }
  pausar(t: Toast) { this.pausados.add(t.id); }
  retomar(t: Toast) { this.pausados.delete(t.id); }
  fechar(t: Toast) { this.pausados.delete(t.id); this.servico.fechar(t.id); }
  ngOnDestroy() { this.pausados.clear(); }
}
