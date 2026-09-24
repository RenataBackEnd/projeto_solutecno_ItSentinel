import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ChamadoService, Maquina } from '../../services/chamado';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  listaMaquinas: Maquina[] = [];
  qtdAtencao: number = 0;
  qtdCritico: number = 0;

  nivelFonte = 0;
  altoContrasteAtivo = false;

  // Controlos dos painéis laterais
  mostrarModalRelatorio: boolean = false;
  mostrarModalInventario: boolean = false;

  constructor(private chamadoService: ChamadoService) {}

  ngOnInit() {
    this.chamadoService.maquinas$.subscribe(maquinas => {
      this.listaMaquinas = maquinas;
      this.qtdAtencao = maquinas.filter(m => m.status === 'Atenção').length;
      this.qtdCritico = maquinas.filter(m => m.status === 'Crítico').length;
    });
  }

  // Funções de Relatório (Acionadas pelo menu lateral)
  abrirModalRelatorio() {
    this.mostrarModalRelatorio = true;
  }

  fecharModalRelatorio() {
    this.mostrarModalRelatorio = false;
  }

  // Funções de Inventário (Acionadas pelo menu lateral)
  abrirModalInventario() {
    this.mostrarModalInventario = true;
  }

  fecharModalInventario() {
    this.mostrarModalInventario = false;
  }

// FUNÇÕES DE ACESSIBILIDADE 

  aumentarFonte() {
    if (this.nivelFonte < 2) {
      this.nivelFonte++;
      this.aplicarAcessibilidade();
    }
  }

  diminuirFonte() {
    if (this.nivelFonte > 0) {
      this.nivelFonte--;
      this.aplicarAcessibilidade();
    }
  }

  alternarContraste() {
    this.altoContrasteAtivo = !this.altoContrasteAtivo;
    this.aplicarAcessibilidade();
  }

  aplicarAcessibilidade() {
    const body = document.body;
    
    // Controla o tamanho da fonte globalmente
    body.classList.remove('fonte-grande', 'fonte-maior');
    if (this.nivelFonte === 1) body.classList.add('fonte-grande');
    if (this.nivelFonte === 2) body.classList.add('fonte-maior');

    // Controla o alto contraste
    if (this.altoContrasteAtivo) {
      body.classList.add('alto-contraste');
    } else {
      body.classList.remove('alto-contraste');
    }
  }

  ativarLibras() {
    // Abre a página oficial do VLibras em nova aba
    window.open('https://www.gov.br/governodigital/pt-br/vlibras', '_blank');
  }
}
