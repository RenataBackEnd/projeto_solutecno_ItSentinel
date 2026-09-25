import { Injectable, signal } from '@angular/core';

export interface PedidoConfirmacao {
  titulo: string;
  mensagem: string;
  confirmar: string;
  cancelar?: string;
  perigo?: boolean;
  icone?: string;
  resolver: (ok: boolean) => void;
}

/**
 * Janela de confirmação acessível (usa <dialog> nativo: prende o foco e fecha com Esc).
 * Uso: if (await confirmacao.perguntar({...})) { ... }
 */
@Injectable({ providedIn: 'root' })
export class ConfirmacaoService {
  readonly pedido = signal<PedidoConfirmacao | null>(null);

  perguntar(opcoes: Omit<PedidoConfirmacao, 'resolver'>): Promise<boolean> {
    this.pedido()?.resolver(false);
    return new Promise(resolver => this.pedido.set({ ...opcoes, resolver }));
  }

  responder(ok: boolean) {
    const p = this.pedido();
    this.pedido.set(null);
    p?.resolver(ok);
  }
}
