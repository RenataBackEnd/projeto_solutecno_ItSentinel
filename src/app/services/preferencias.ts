import { Injectable, signal, effect } from '@angular/core';

export type Tema = 'light' | 'dark';

/**
 * Preferências de acessibilidade compartilhadas por todas as páginas:
 * - Tema claro/escuro (respeita a preferência do sistema na 1ª visita)
 * - Tamanho da fonte (3 níveis)
 * As escolhas ficam salvas no navegador e são aplicadas no <html>.
 */
@Injectable({ providedIn: 'root' })
export class PreferenciasService {
  private readonly CHAVE_TEMA = 'itsentinel.tema';
  private readonly CHAVE_FONTE = 'itsentinel.fonte';

  readonly tema = signal<Tema>(this.lerTemaInicial());
  readonly nivelFonte = signal<number>(this.lerFonteInicial());

  readonly NIVEL_MAXIMO = 2;

  constructor() {
    // Sempre que o tema ou a fonte mudarem, aplica no documento e salva.
    effect(() => {
      const tema = this.tema();
      document.documentElement.setAttribute('data-theme', tema);
      document.querySelector('meta[name="theme-color"]')
        ?.setAttribute('content', tema === 'dark' ? '#0f1612' : '#1a4a2f');
      this.salvar(this.CHAVE_TEMA, tema);
    });

    effect(() => {
      const nivel = this.nivelFonte();
      document.documentElement.setAttribute('data-fonte', String(nivel));
      this.salvar(this.CHAVE_FONTE, String(nivel));
    });
  }

  alternarTema() {
    this.tema.update(t => (t === 'dark' ? 'light' : 'dark'));
  }

  aumentarFonte() {
    this.nivelFonte.update(n => Math.min(n + 1, this.NIVEL_MAXIMO));
  }

  diminuirFonte() {
    this.nivelFonte.update(n => Math.max(n - 1, 0));
  }

  private lerTemaInicial(): Tema {
    const salvo = this.ler(this.CHAVE_TEMA);
    if (salvo === 'light' || salvo === 'dark') return salvo;
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  private lerFonteInicial(): number {
    const n = Number(this.ler(this.CHAVE_FONTE));
    return Number.isInteger(n) && n >= 0 && n <= 2 ? n : 0;
  }

  private ler(chave: string): string | null {
    try { return localStorage.getItem(chave); } catch { return null; }
  }

  private salvar(chave: string, valor: string) {
    try { localStorage.setItem(chave, valor); } catch { /* navegação privada */ }
  }
}
