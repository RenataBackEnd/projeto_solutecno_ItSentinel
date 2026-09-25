import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Prioridade = 'Atenção' | 'Crítico';

/** Etapas do atendimento. "impedido" é um desvio (imprevisto) que pode acontecer em qualquer etapa ativa. */
export type Etapa = 'aberto' | 'em-analise' | 'em-atendimento' | 'impedido' | 'resolvido';

export const FLUXO: Etapa[] = ['aberto', 'em-analise', 'em-atendimento', 'resolvido'];

export const INFO_ETAPA: Record<Etapa, { titulo: string; descricao: string; icone: string }> = {
  'aberto':         { titulo: 'Aberto',         descricao: 'Chamado registrado e enviado à equipe de TI', icone: 'caixa' },
  'em-analise':     { titulo: 'Em análise',     descricao: 'A equipe está diagnosticando o problema',   icone: 'busca' },
  'em-atendimento': { titulo: 'Em atendimento', descricao: 'Um técnico está trabalhando na solução',   icone: 'ferramenta' },
  'impedido':       { titulo: 'Imprevisto',     descricao: 'O atendimento foi pausado por um imprevisto', icone: 'alerta' },
  'resolvido':      { titulo: 'Resolvido',      descricao: 'Problema solucionado e chamado encerrado',   icone: 'check-circulo' },
};

export const MOTIVOS_IMPREVISTO = [
  'Aguardando peça de reposição',
  'Equipamento indisponível para manutenção',
  'Falha adicional encontrada no diagnóstico',
  'Aguardando retorno do solicitante',
];

export interface EventoChamado {
  etapa: Etapa;
  data: string; // ISO
  nota?: string;
}

export interface Chamado {
  id: string;               // protocolo, ex.: CH-2026-0001
  nome: string;             // equipamento
  status: Prioridade;       // prioridade (nome mantido por compatibilidade)
  problema: string;
  nomeUsuario?: string;
  emailUsuario?: string;
  setorUsuario?: string;
  etapa: Etapa;
  etapaAntesDoImprevisto?: Etapa;
  historico: EventoChamado[];
  criadoEm: string;
}

/** Mantido para compatibilidade com o código antigo */
export type Maquina = Chamado;

@Injectable({ providedIn: 'root' })
export class ChamadoService {
  private readonly CHAVE = 'itsentinel.chamados.v2';

  private chamadosSubject = new BehaviorSubject<Chamado[]>(this.carregar());
  chamados$ = this.chamadosSubject.asObservable();
  /** Alias antigo usado pelo Dashboard */
  maquinas$ = this.chamados$;

  getChamados() { return this.chamadosSubject.getValue(); }
  getMaquinas() { return this.getChamados(); }
  porId(id: string) { return this.getChamados().find(c => c.id === id) ?? null; }
  doUsuario(email: string) { return this.getChamados().filter(c => c.emailUsuario === email); }

  abrirChamado(dados: Pick<Chamado, 'nome' | 'status' | 'problema' | 'nomeUsuario' | 'emailUsuario' | 'setorUsuario'>): Chamado {
    const agora = new Date().toISOString();
    const novo: Chamado = {
      ...dados,
      id: this.novoProtocolo(),
      etapa: 'aberto',
      historico: [{ etapa: 'aberto', data: agora }],
      criadoEm: agora,
    };
    this.salvar([novo, ...this.getChamados()]);
    return novo;
  }

  /** Próxima etapa do fluxo normal (null se já resolvido ou impedido) */
  proximaEtapa(c: Chamado): Etapa | null {
    if (c.etapa === 'impedido' || c.etapa === 'resolvido') return null;
    return FLUXO[FLUXO.indexOf(c.etapa) + 1] ?? null;
  }

  avancar(id: string, nota?: string) {
    return this.atualizar(id, c => {
      const proxima = this.proximaEtapa(c);
      return proxima ? this.mover(c, proxima, nota) : c;
    });
  }

  relatarImprevisto(id: string, motivo: string) {
    return this.atualizar(id, c =>
      c.etapa === 'resolvido' || c.etapa === 'impedido' ? c
        : { ...this.mover(c, 'impedido', motivo), etapaAntesDoImprevisto: c.etapa });
  }

  retomar(id: string) {
    return this.atualizar(id, c =>
      c.etapa !== 'impedido' ? c
        : { ...this.mover(c, c.etapaAntesDoImprevisto ?? 'em-analise', 'Atendimento retomado'), etapaAntesDoImprevisto: undefined });
  }

  reabrir(id: string) {
    return this.atualizar(id, c => c.etapa !== 'resolvido' ? c : this.mover(c, 'em-analise', 'Chamado reaberto'));
  }

  private mover(c: Chamado, etapa: Etapa, nota?: string): Chamado {
    return { ...c, etapa, historico: [...c.historico, { etapa, data: new Date().toISOString(), nota }] };
  }

  private atualizar(id: string, fn: (c: Chamado) => Chamado): Chamado | null {
    let resultado: Chamado | null = null;
    const lista = this.getChamados().map(c => c.id === id ? (resultado = fn(c)) : c);
    this.salvar(lista);
    return resultado;
  }

  private salvar(lista: Chamado[]) {
    this.chamadosSubject.next(lista);
    try { localStorage.setItem(this.CHAVE, JSON.stringify(lista)); } catch { /* sem armazenamento */ }
  }

  private novoProtocolo() {
    const ano = new Date().getFullYear();
    const maior = this.getChamados()
      .map(c => Number(c.id.split('-')[2]) || 0)
      .reduce((a, b) => Math.max(a, b), 0);
    return `CH-${ano}-${String(maior + 1).padStart(4, '0')}`;
  }

  private carregar(): Chamado[] {
    try {
      const salvo = localStorage.getItem(this.CHAVE);
      if (salvo) {
        const lista = JSON.parse(salvo);
        if (Array.isArray(lista)) return lista;
      }
    } catch { /* ignora dados corrompidos */ }
    return this.exemplos();
  }

  /** Chamados de exemplo para o protótipo */
  private exemplos(): Chamado[] {
    const dias = (n: number) => new Date(Date.now() - n * 86400000).toISOString();
    return [
      {
        id: 'CH-2026-0002', nome: 'Impressora RH', status: 'Crítico', problema: 'Não imprime e luz vermelha piscando',
        nomeUsuario: 'Equipe de TI', setorUsuario: 'RH', etapa: 'em-analise', criadoEm: dias(1),
        historico: [{ etapa: 'aberto', data: dias(1) }, { etapa: 'em-analise', data: dias(0.5) }],
      },
      {
        id: 'CH-2026-0001', nome: 'Computador - Recepção', status: 'Atenção', problema: 'Lentidão na inicialização',
        nomeUsuario: 'Equipe de TI', setorUsuario: 'Recepção', etapa: 'aberto', criadoEm: dias(2),
        historico: [{ etapa: 'aberto', data: dias(2) }],
      },
    ];
  }
}
