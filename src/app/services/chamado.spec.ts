import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// Estrutura exata baseada no seu Dashboard
export interface Maquina {
  nome: string;
  status: 'Saudável' | 'Atenção' | 'Crítico';
  problema: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChamadoService {
  // Lista inicial baseada na sua imagem do Dashboard
  private maquinasIniciais: Maquina[] = [
    { nome: 'Diretório de PCs', status: 'Crítico', problema: 'aquecimento de CPU' },
    { nome: 'NB-Financeiro-04', status: 'Atenção', problema: '97%' },
    { nome: 'PC-Atendimento-12', status: 'Atenção', problema: 'Atualização' },
    { nome: 'SRV-ARQUIVOS-01', status: 'Crítico', problema: 'Backup não realizado' }
  ];

  // O "rádio transmissor" que avisa o Dashboard quando algo muda
  private maquinasSubject = new BehaviorSubject<Maquina[]>(this.maquinasIniciais);
  
  // Variável que o Dashboard vai ficar escutando
  maquinas$ = this.maquinasSubject.asObservable();

  constructor() { }

  // Função para adicionar um novo chamado
  abrirChamado(novaMaquina: Maquina) {
    const listaAtual = this.maquinasSubject.value;
    // Adiciona o novo chamado no início da lista
    this.maquinasSubject.next([novaMaquina, ...listaAtual]);
  }
}