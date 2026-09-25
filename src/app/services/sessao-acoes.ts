import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth';
import { ConfirmacaoService } from './confirmacao';
import { ToastService } from './toast';

/** Ações de sessão com confirmação e retorno visual (usadas no Dashboard e na área de chamados). */
@Injectable({ providedIn: 'root' })
export class SessaoAcoes {
  private auth = inject(AuthService);
  private confirmacao = inject(ConfirmacaoService);
  private toast = inject(ToastService);
  private router = inject(Router);

  async sair(destino: string = '/login') {
    const ok = await this.confirmacao.perguntar({
      titulo: 'Sair do sistema?',
      mensagem: 'Sua sessão será encerrada neste dispositivo. Para voltar, será preciso entrar novamente.',
      confirmar: 'Sim, sair',
      cancelar: 'Continuar conectado',
      icone: 'sair',
      perigo: true,
    });
    if (!ok) return false;
    this.auth.sair();
    this.toast.limpar();
    this.toast.sucesso('Você saiu do sistema', 'Sessão encerrada com segurança. Até logo!');
    this.router.navigate([destino]);
    return true;
  }
}
