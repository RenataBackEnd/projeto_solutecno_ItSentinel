import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router'; // O Router serve para mudar de página via código
import { FormsModule } from '@angular/forms'; // Necessário para o formulário funcionar [(ngModel)]
import { CommonModule } from '@angular/common'; // Necessário para exibir a mensagem de erro (ngIf)

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule], // Importou módulos
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  
  // Variáveis para guardar o que a Renata (ou outro usuário) digitar
  emailUsuario: string = '';
  senhaUsuario: string = '';
  
  // Variável para mostrar a mensagem de erro na tela
  mensagemErro: string = '';

  // Injetado Router no construtor para podermos enviar o usuário pro Dashboard
  constructor(private router: Router) {}

  // A função que é chamada quando o botão "Entrar" é clicado
  fazerLogin() {
    this.mensagemErro = ''; // Limpa os erros anteriores

    // Verifica se a pessoa não digitou absolutamente nada
    if (!this.emailUsuario || !this.senhaUsuario) {
      this.mensagemErro = 'Por favor, preencha o e-mail e a senha.';
      return;
    }

    // Validação da Senha (Avisando quantos caracteres foram digitados)
    const tamanhoSenha = this.senhaUsuario.length;
    if (tamanhoSenha < 8) {
      this.mensagemErro = `Sua senha tem apenas ${tamanhoSenha} caracteres. O mínimo exigido são 8.`;
      return;
    }

    // Validação Estrita: A senha precisa ser EXATAMENTE a definida por segurança
    if (this.senhaUsuario !== '12345678') {
      this.mensagemErro = 'Senha incorreta. Acesso negado.';
      return;
    }

    // Validação do E-mail Corporativo
    const dominioOficial = '@solutecno.com.br';
    
    if (!this.emailUsuario.toLowerCase().endsWith(dominioOficial)) {
       this.mensagemErro = 'Acesso negado: Utilize um e-mail corporativo válido (ex: @solutecno.com.br).';
       return;
    }

    // Encaminha o usuário para o Dashboard se passar em tudo
    this.router.navigate(['/dashboard']);
  }
}