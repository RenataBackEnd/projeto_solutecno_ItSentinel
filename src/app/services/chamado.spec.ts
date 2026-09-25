import { TestBed } from '@angular/core/testing';
import { ChamadoService } from './chamado';

describe('ChamadoService', () => {
  let service: ChamadoService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChamadoService);
  });

  it('abre um chamado com protocolo e etapa "aberto"', () => {
    const c = service.abrirChamado({ nome: 'PC Teste', status: 'Crítico', problema: 'Não liga', emailUsuario: 'a@solutecno.com.br' });
    expect(c.id).toMatch(/^CH-\d{4}-\d{4}$/);
    expect(c.etapa).toBe('aberto');
    expect(service.getChamados()[0].id).toBe(c.id);
    expect(localStorage.getItem('itsentinel.chamados.v2')).toContain('PC Teste');
  });

  it('percorre o fluxo completo, com imprevisto e retomada', () => {
    const { id } = service.abrirChamado({ nome: 'PC', status: 'Atenção', problema: 'Lento demais' });
    expect(service.avancar(id)?.etapa).toBe('em-analise');
    expect(service.relatarImprevisto(id, 'Aguardando peça')?.etapa).toBe('impedido');
    expect(service.avancar(id)?.etapa).toBe('impedido');           // não avança enquanto impedido
    expect(service.retomar(id)?.etapa).toBe('em-analise');           // volta para onde estava
    expect(service.avancar(id)?.etapa).toBe('em-atendimento');
    expect(service.avancar(id)?.etapa).toBe('resolvido');
    expect(service.reabrir(id)?.etapa).toBe('em-analise');
    expect(service.porId(id)!.historico.length).toBe(7);
  });
});
