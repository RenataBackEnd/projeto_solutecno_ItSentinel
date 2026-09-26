import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Icone } from '../../components/icone/icone';
import { BarraAcessibilidade } from '../../components/barra-acessibilidade/barra-acessibilidade';
import { AuthService, Sessao } from '../../services/auth';
import { ToastService } from '../../services/toast';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule, Icone, BarraAcessibilidade],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private router = inject(Router);
  private auth = inject(AuthService);
  private toast = inject(ToastService);

  emailUsuario = '';
  senhaUsuario = '';
  mostrarSenha = false;
  manterConectado = false;
  carregando = false;

  // Credenciais válidas, mas de um colaborador (sem acesso ao Dashboard)
  colaboradorSemAcesso: Sessao | null = null;

  erros = { email: '', senha: '' };

  constructor() {
    // Já logado como admin? Vai direto ao painel.
    if (this.auth.ehAdmin()) this.router.navigate(['/dashboard']);
  }

  fazerLogin() {
    this.erros = { email: '', senha: '' };
    this.colaboradorSemAcesso = null;

    const resultado = this.auth.validar(this.emailUsuario, this.senhaUsuario);
    if (!resultado.ok) this.erros[resultado.campo] = resultado.mensagem;
    if (!resultado.ok) {
      const credencialErrada = !resultado.ok && resultado.mensagem.startsWith('E-mail ou senha');
      this.toast.erro(credencialErrada ? 'Acesso negado' : 'Não foi possível entrar',
        credencialErrada ? 'E-mail ou senha incorretos. Tente novamente.' : 'Revise os campos destacados no formulário.');
      this.focarPrimeiroErro();
      return;
    }

    // Colaborador: credenciais corretas, mas SEM permissão para o Dashboard
    if (resultado.sessao.perfil !== 'admin') {
      this.colaboradorSemAcesso = resultado.sessao;
      this.toast.erro('Acesso restrito ao administrador',
        'Seu perfil de colaborador não tem acesso ao Dashboard.');
      setTimeout(() => document.getElementById('aviso-perfil')?.focus());
      return;
    }

    this.carregando = true;
    this.auth.iniciar(resultado.sessao, this.manterConectado);
    this.toast.sucesso('Login realizado com sucesso', this.manterConectado
      ? 'Sua sessão ficará salva neste dispositivo.'
      : 'Sua sessão termina ao fechar o navegador.');
    this.router.navigate(['/dashboard']);
  }

  /** Colaborador segue para a área de chamados já identificado */
  continuarComoColaborador() {
    if (!this.colaboradorSemAcesso) return;
    this.auth.iniciar(this.colaboradorSemAcesso, this.manterConectado);
    this.toast.sucesso(`Olá, ${this.colaboradorSemAcesso.nome}!`, 'Você já está identificado para abrir um chamado.');
    this.router.navigate(['/chamado']);
  }

  preencherDemo(email: string) {
    this.emailUsuario = email;
    this.senhaUsuario = '12345678';
    this.erros = { email: '', senha: '' };
    this.colaboradorSemAcesso = null;
  }

  private focarPrimeiroErro() {
    const id = this.erros.email ? 'email' : 'senha';
    setTimeout(() => document.getElementById(id)?.focus());
  }
}
