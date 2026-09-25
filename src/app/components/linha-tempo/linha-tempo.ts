import { Component, computed, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Chamado, Etapa, FLUXO, INFO_ETAPA } from '../../services/chamado';
import { Icone } from '../icone/icone';

interface Passo {
  etapa: Etapa;
  titulo: string;
  descricao: string;
  icone: string;
  estado: 'feito' | 'atual' | 'impedido' | 'pendente';
  data?: string;
  nota?: string;
}

/**
 * Linha do tempo do chamado (usada no Dashboard e em "Meus chamados").
 * Mostra as 4 etapas do fluxo e, quando houver, o imprevisto na posição em que ocorreu.
 */
@Component({
  selector: 'app-linha-tempo',
  standalone: true,
  imports: [Icone, DatePipe],
  template: `
    <ol class="linha-tempo" [attr.aria-label]="'Andamento do chamado ' + chamado().id">
      @for (p of passos(); track p.etapa) {
        <li [class]="p.estado" [attr.aria-current]="p.estado === 'atual' || p.estado === 'impedido' ? 'step' : null">
          <span class="marcador" aria-hidden="true">
            <app-icone [nome]="p.estado === 'feito' ? 'check' : p.icone" [tamanho]="16" [traco]="p.estado === 'feito' ? 3 : 2" />
          </span>
          <div class="texto">
            <strong>{{ p.titulo }}
              <span class="sr-only">— {{ rotuloEstado[p.estado] }}</span>
              @if (p.data) { <time [attr.datetime]="p.data">{{ p.data | date: "dd/MM 'às' HH:mm" }}</time> }
            </strong>
            <small>{{ p.nota || p.descricao }}</small>
          </div>
        </li>
      }
    </ol>`,
  styles: `
    .linha-tempo { list-style: none; display: flex; flex-direction: column; gap: 1.125rem; position: relative; }
    .linha-tempo::before { content: ""; position: absolute; left: 1.0625rem; top: 1rem; bottom: 1rem; width: 2px; background: var(--cor-borda); }
    li { position: relative; display: flex; align-items: flex-start; gap: .875rem; }
    .texto { display: flex; flex-direction: column; padding-top: .375rem; min-width: 0; }
    strong { display: flex; flex-wrap: wrap; align-items: baseline; gap: .5rem; font-size: .9375rem; color: var(--cor-texto-suave); }
    time { font-size: .75rem; font-weight: 500; color: var(--cor-texto-suave); }
    small { font-size: .8125rem; color: var(--cor-texto-suave); line-height: 1.4; }
    .marcador {
      display: grid; place-items: center; flex-shrink: 0; width: 2.25rem; height: 2.25rem; border-radius: 50%; z-index: 1;
      background: var(--cor-superficie-2); color: var(--cor-texto-suave); border: 2px solid var(--cor-borda);
    }
    .feito .marcador { background: var(--cor-primaria); border-color: var(--cor-primaria); color: var(--cor-sobre-primaria); }
    .feito strong, .atual strong { color: var(--cor-titulo); }
    .atual .marcador { background: var(--cor-primaria-suave); border-color: var(--cor-primaria); color: var(--cor-primaria);
      box-shadow: 0 0 0 4px color-mix(in srgb, var(--cor-primaria) 18%, transparent); }
    .impedido .marcador { background: var(--cor-alerta-fundo); border-color: var(--cor-alerta); color: var(--cor-alerta);
      box-shadow: 0 0 0 4px color-mix(in srgb, var(--cor-alerta) 20%, transparent); }
    .impedido strong { color: var(--cor-alerta); }
    .impedido small { color: var(--cor-texto); }
    .pendente { opacity: .8; }
  `,
})
export class LinhaTempo {
  chamado = input.required<Chamado>();

  protected rotuloEstado = { feito: 'concluída', atual: 'etapa atual', impedido: 'imprevisto em andamento', pendente: 'pendente' };

  passos = computed<Passo[]>(() => {
    const c = this.chamado();
    const ultimaData = (e: Etapa) => [...c.historico].reverse().find(h => h.etapa === e);
    const etapaBase = c.etapa === 'impedido' ? (c.etapaAntesDoImprevisto ?? 'aberto') : c.etapa;
    const indiceAtual = FLUXO.indexOf(etapaBase);

    const passos: Passo[] = FLUXO.map((etapa, i) => {
      let estado: Passo['estado'] = i < indiceAtual ? 'feito' : i === indiceAtual ? 'atual' : 'pendente';
      if (etapa === 'resolvido' && c.etapa === 'resolvido') estado = 'feito';
      if (c.etapa === 'impedido' && i === indiceAtual) estado = 'feito';
      const evento = i <= indiceAtual ? ultimaData(etapa) : undefined;
      return { etapa, ...INFO_ETAPA[etapa], estado, data: evento?.data, nota: evento?.nota };
    });

    if (c.etapa === 'impedido') {
      const ev = ultimaData('impedido');
      passos.splice(indiceAtual + 1, 0, { etapa: 'impedido', ...INFO_ETAPA.impedido, estado: 'impedido', data: ev?.data, nota: ev?.nota });
    }
    return passos;
  });
}
