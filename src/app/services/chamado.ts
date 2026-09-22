import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Maquina {
  nome: string;
  status: 'Saudável' | 'Atenção' | 'Crítico';
  problema: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChamadoService {
  private maquinasIniciais: Maquina[] = [
    { nome: 'Diretório de PCs', status: 'Crítico', problema: 'aquecimento de CPU' },
    { nome: 'NB-Financeiro-04', status: 'Atenção', problema: '97%' }
  ];

  private maquinasSubject = new BehaviorSubject<Maquina[]>(this.maquinasIniciais);
  maquinas$ = this.maquinasSubject.asObservable();

  constructor() { }

  abrirChamado(novaMaquina: Maquina) {
    const listaAtual = this.maquinasSubject.value;
    this.maquinasSubject.next([novaMaquina, ...listaAtual]);
  }
}