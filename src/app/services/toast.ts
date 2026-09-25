import { Injectable, signal } from '@angular/core';

export type TipoToast = 'sucesso' | 'erro' | 'alerta' | 'info';

export interface Toast {
  id: number;
  tipo: TipoToast;
  titulo: string;
  mensagem?: string;
  duracao: number;
}

/**
 * Serviço de notificações pop-up (toasts).
 * Uso: toast.sucesso('Chamado registrado', 'A equipe de TI foi notificada.')
 * O usuário pode fechar clicando no "X" ou em qualquer parte do aviso.
 */
@Injectable({ providedIn: 'root' })
export class ToastService {
  private proximoId = 1;
  readonly toasts = signal<Toast[]>([]);

  sucesso(titulo: string, mensagem?: string) {
    // Um sucesso resolve os erros anteriores: remove-os para não confundir
    this.toasts.update(lista => lista.filter(t => t.tipo !== 'erro'));
    return this.mostrar('sucesso', titulo, mensagem);
  }
  erro(titulo: string, mensagem?: string) { return this.mostrar('erro', titulo, mensagem, 8000); }
  alerta(titulo: string, mensagem?: string) { return this.mostrar('alerta', titulo, mensagem, 7000); }
  info(titulo: string, mensagem?: string) { return this.mostrar('info', titulo, mensagem); }

  mostrar(tipo: TipoToast, titulo: string, mensagem?: string, duracao = 5000): number {
    const id = this.proximoId++;
    // Evita pilhas de avisos idênticos (ex.: clicar "Entrar" várias vezes)
    this.toasts.update(lista => [
      ...lista.filter(t => !(t.titulo === titulo && t.mensagem === mensagem)),
      { id, tipo, titulo, mensagem, duracao },
    ].slice(-3));
    return id;
  }

  limpar() { this.toasts.set([]); }

  fechar(id: number) {
    this.toasts.update(lista => lista.filter(t => t.id !== id));
  }
}
