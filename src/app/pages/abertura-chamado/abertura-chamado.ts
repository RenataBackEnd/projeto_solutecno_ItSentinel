import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router'; 
import { ChamadoService, Maquina } from '../../services/chamado';

@Component({
  selector: 'app-abertura-chamado',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink], 
  templateUrl: './abertura-chamado.html',
  styleUrls: ['./abertura-chamado.css']
})
export class AberturaChamadoComponent {
  
  // --- VARIÁVEIS DE LOGIN DO USUÁRIO ---
  usuarioLogado: boolean = false;
  emailUsuario: string = '';
  senhaUsuario: string = '';
  mensagemErroLogin: string = '';

  // --- VARIÁVEIS DO CHAMADO ---
  nomeMaquina: string = '';
  statusSelecionado: 'Atenção' | 'Crítico' = 'Atenção';
  descricaoProblema: string = '';
  nomeSolicitante: string = ''; 
  setorSolicitante: string = '';
  mensagemSucesso: boolean = false;

  constructor(private chamadoService: ChamadoService) {}

  // Função para verificar a senha e as regras de segurança antes de liberar o formulário
  fazerLoginUsuario() {
    this.mensagemErroLogin = ''; // Limpa os erros anteriores

    // Verifica se a pessoa não preencheu algum dos campos
    if (!this.emailUsuario || !this.senhaUsuario) {
      this.mensagemErroLogin = 'Por favor, preencha o e-mail e a senha.';
      return;
    }

    // Validação da Senha (Avisando quantos caracteres foram digitados se menor que 8)
    const tamanhoSenha = this.senhaUsuario.length;
    if (tamanhoSenha < 8) {
      this.mensagemErroLogin = `Sua senha tem apenas ${tamanhoSenha} caracteres. O mínimo exigido são 8.`;
      return;
    }

    // Validação Estrita: A senha precisa ser exatamente 12345678
    if (this.senhaUsuario !== '12345678') {
      this.mensagemErroLogin = 'Senha incorreta. Acesso negado.';
      return;
    }

    // Se passar por todas as validações, libera a tela de abertura de chamado!
    this.usuarioLogado = true; 
    
    // Pega a primeira parte do e-mail para usar como nome automático
    this.nomeSolicitante = this.emailUsuario.split('@')[0]; 
  }

  enviarChamado() {
    if (this.nomeMaquina && this.descricaoProblema && this.nomeSolicitante) {
      const novoChamado: Maquina = {
        nome: this.nomeMaquina,
        status: this.statusSelecionado as any,
        problema: this.descricaoProblema,
        nomeUsuario: this.nomeSolicitante,
        setorUsuario: this.setorSolicitante
      };

      this.chamadoService.abrirChamado(novoChamado);
      this.mensagemSucesso = true;
      
      this.nomeMaquina = '';
      this.descricaoProblema = '';
    } else {
      alert('Atenção: Preencha a máquina e o problema antes de registrar o chamado.');
    }
  }
}