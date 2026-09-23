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
}