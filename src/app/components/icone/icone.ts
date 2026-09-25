import { Component, computed, input } from '@angular/core';

// Ícones em traço (estilo Lucide, licença ISC) desenhados como <path>.
// Substituem emojis e PNGs de 16px que ficavam borrados e inconsistentes.
const c = (cx: number, cy: number, r: number) =>
  `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`;
const r = (x: number, y: number, w: number, h: number, rx = 0) =>
  `M${x + rx} ${y}h${w - 2 * rx}a${rx} ${rx} 0 0 1 ${rx} ${rx}v${h - 2 * rx}a${rx} ${rx} 0 0 1 ${-rx} ${rx}h${-(w - 2 * rx)}a${rx} ${rx} 0 0 1 ${-rx} ${-rx}v${-(h - 2 * rx)}a${rx} ${rx} 0 0 1 ${rx} ${-rx}z`;

type Traco = string | { d: string; t: string; sw: number };
const ICONES: Record<string, Traco[]> = {
  sol: [c(12, 12, 4), 'M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41'],
  lua: ['M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z'],
  olho: ['M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0', c(12, 12, 3)],
  'olho-fechado': ['M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49', 'M14.084 14.158a3 3 0 0 1-4.242-4.242', 'M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143', 'm2 2 20 20'],
  'seta-esquerda': ['m12 19-7-7 7-7', 'M19 12H5'],
  'seta-direita': ['M5 12h14', 'm12 5 7 7-7 7'],
  'chevron-esquerda': ['m15 18-6-6 6-6'],
  'chevron-direita': ['m9 18 6-6-6-6'],
  casa: ['M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8', 'M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z'],
  grade: [r(3, 3, 7, 7, 1), r(14, 3, 7, 7, 1), r(14, 14, 7, 7, 1), r(3, 14, 7, 7, 1)],
  caixa: ['M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z', 'm3.3 7 8.7 5 8.7-5', 'M12 22V12'],
  grafico: ['M3 3v16a2 2 0 0 0 2 2h16', 'M18 17V9', 'M13 17V5', 'M8 17v-3'],
  sair: ['M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4', 'm16 17 5-5-5-5', 'M21 12H9'],
  ajuda: [c(12, 12, 10), 'M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3', 'M12 17h.01'],
  busca: [c(11, 11, 8), 'm21 21-4.3-4.3'],
  x: ['M18 6 6 18', 'm6 6 12 12'],
  'check-circulo': [c(12, 12, 10), 'm9 12 2 2 4-4'],
  check: ['M20 6 9 17l-5-5'],
  alerta: ['m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3', 'M12 9v4', 'M12 17h.01'],
  erro: [c(12, 12, 10), 'M12 8v4', 'M12 16h.01'],
  info: [c(12, 12, 10), 'M12 16v-4', 'M12 8h.01'],
  escudo: ['M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z', 'm9 12 2 2 4-4'],
  monitor: [r(2, 3, 20, 14, 2), 'M8 21h8', 'M12 17v4'],
  impressora: ['M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2', 'M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6', r(6, 14, 12, 8, 1)],
  globo: [c(12, 12, 10), 'M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20', 'M2 12h20'],
  instagram: [r(2, 2, 20, 20, 5), 'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z', 'M17.5 6.5h.01'],
  // Balão de conversa + telefone (identidade visual reconhecível do WhatsApp)
  whatsapp: ['M3.5 20.5l1.3-3.9A8.9 8.9 0 1 1 8 19.6z', { d: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z', t: 'translate(7.1 6.6) scale(.42)', sw: 4.2 }],
  mao: ['M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2', 'M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2', 'M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8', 'M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15'],
  cadeado: [r(3, 11, 18, 11, 2), 'M7 11V7a5 5 0 0 1 10 0v4'],
  email: [r(2, 4, 20, 16, 2), 'm22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7'],
  menu: ['M4 6h16', 'M4 12h16', 'M4 18h16'],
  mais: [c(12, 12, 10), 'M8 12h8', 'M12 8v8'],
  atividade: ['M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2'],
  historico: ['M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8', 'M3 3v5h5', 'M12 7v5l4 2'],
  ferramenta: ['M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z'],
  pausa: [r(6, 4, 4, 16, 1), r(14, 4, 4, 16, 1)],
  play: ['M6 3l14 9-14 9V3z'],
  tendencia: ['M22 7 13.5 15.5 8.5 10.5 2 17', 'M16 7h6v6'],
  'tendencia-baixa': ['M22 17 13.5 8.5 8.5 13.5 2 7', 'M16 17h6v-6'],
  usuario: ['M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2', c(12, 7, 4)],
  externo: ['M15 3h6v6', 'M10 14 21 3', 'M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6'],
};

@Component({
  selector: 'app-icone',
  standalone: true,
  host: { style: 'display:inline-flex;flex-shrink:0;line-height:0' },
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         [attr.width]="tamanho()" [attr.height]="tamanho()" [attr.stroke-width]="traco()"
         stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
      @for (c of caminhos(); track $index) {
        @if (texto(c)) { <path [attr.d]="c" /> }
        @else { <path [attr.d]="$any(c).d" [attr.transform]="$any(c).t" [attr.stroke-width]="$any(c).sw" /> }
      }
    </svg>`,
})
export class Icone {
  nome = input.required<string>();
  tamanho = input<number | string>(20);
  traco = input<number>(2);
  caminhos = computed(() => ICONES[this.nome()] ?? []);
  texto(c: Traco): c is string { return typeof c === 'string'; }
}
