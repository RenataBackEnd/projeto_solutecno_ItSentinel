import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChamadoService, Maquina } from '../../services/chamado';
import { Router } from '@angular/router'; // ROUTER IMPORTADO

@Component({
  selector: 'app-abertura-chamado',
  standalone: true,
  imports: [CommonModule, FormsModule], // Não precisou mais do RouterLink no HTML
  templateUrl: './abertura-chamado.html',
  styleUrls: ['./abertura-chamado.css']
})
export class AberturaChamadoComponent {
  nomeMaquina: string = '';
  statusSelecionado: 'Atenção' | 'Crítico' = 'Atenção';
  descricaoProblema: string = '';
  mensagemSucesso: boolean = false;

  // INJETAMOS O ROUTER NO CONSTRUTOR
  constructor(private chamadoService: ChamadoService, private router: Router) {}

  enviarChamado() {
    if (this.nomeMaquina && this.descricaoProblema) {
      const novoChamado: Maquina = {
        nome: this.nomeMaquina,
        status: this.statusSelecionado as any,
        problema: this.descricaoProblema
      };

      this.chamadoService.abrirChamado(novoChamado);
      this.mensagemSucesso = true;

      // Espera 1,5 segundos para o usuário ler a mensagem e o Dashboard aparece
      setTimeout(() => {
        this.router.navigate(['/dashboard']);
      }, 1500);

    } else {
      alert('Por favor, preencha o nome da máquina e o problema.');
    }
  }
}