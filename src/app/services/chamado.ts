import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Maquina {
  nome: string;
  status: 'Atenção' | 'Crítico';
  problema: string;
  nomeUsuario?: string; 
  setorUsuario?: string; 
}

@Injectable({
  providedIn: 'root'
})
export class ChamadoService {
  
  // Lista inicial de testes
  private listaInicial: Maquina[] = [
    { nome: 'Computador - Recepção', status: 'Atenção', problema: 'Lentidão na inicialização' },
    { nome: 'Impressora RH', status: 'Crítico', problema: 'Não imprime e luz vermelha piscando' }
  ];

  // O BehaviorSubject guarda a lista e avisa o Dashboard quando algo muda
  private maquinasSubject = new BehaviorSubject<Maquina[]>(this.listaInicial);
  
  // O Dashboard "ouve" essa variável
  maquinas$ = this.maquinasSubject.asObservable();

  getMaquinas() {
    return this.maquinasSubject.getValue();
  }

  abrirChamado(novaMaquina: Maquina) {
    const listaAtual = this.maquinasSubject.getValue();
    listaAtual.push(novaMaquina);
    
    // Avisa todo o sistema que a lista atualizou em tempo real!
    this.maquinasSubject.next(listaAtual);
  }
}