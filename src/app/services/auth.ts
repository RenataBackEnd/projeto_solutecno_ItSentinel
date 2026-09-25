import { Injectable, signal } from '@angular/core';

export type Perfil = 'admin' | 'colaborador';

export interface Sessao {
  email: string;
  nome: string;
  cargo: string;
  perfil: Perfil;
}

export type ResultadoLogin =
  | { ok: true; sessao: Sessao }
  | { ok: false; campo: 'email' | 'senha'; mensagem: string };

/** Protótipo: senha única de demonstração. Em produção isso vem de um backend. */
const SENHA_DEMO = '12345678';
export const DOMINIO_CORPORATIVO = '@solutecno.com.br';

/** Contas com perfil de ADMINISTRADOR (únicas que acessam o Dashboard). */
const ADMINISTRADORES: Record<string, { nome: string; cargo: string }> = {
  'admin@solutecno.com.br': { nome: 'Administrador', cargo: 'Gestão de TI' },
};

/**
 * Sessão e perfis de acesso.
 * - Administrador: acessa o Dashboard e gerencia chamados.
 * - Colaborador (qualquer outro e-mail @solutecno.com.br): abre e acompanha os próprios chamados.
 * "Manter-me conectado" marcado -> localStorage; desmarcado -> sessionStorage.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly CHAVE = 'itsentinel.sessao';
  readonly sessao = signal<Sessao | null>(this.carregar());

  /** Valida credenciais SEM iniciar sessão. */
  validar(emailDigitado: string, senha: string): ResultadoLogin {
    const email = emailDigitado.trim().toLowerCase();
    if (!email) return { ok: false, campo: 'email', mensagem: 'Informe seu e-mail corporativo.' };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, campo: 'email', mensagem: 'Digite um e-mail válido (ex.: nome@solutecno.com.br).' };
    if (!email.endsWith(DOMINIO_CORPORATIVO)) return { ok: false, campo: 'email', mensagem: `Use seu e-mail corporativo (${DOMINIO_CORPORATIVO}).` };
    if (!senha) return { ok: false, campo: 'senha', mensagem: 'Informe sua senha.' };
    if (senha.length < 8) return { ok: false, campo: 'senha', mensagem: `A senha tem ${senha.length} caracteres. O mínimo é 8.` };
    if (senha !== SENHA_DEMO) return { ok: false, campo: 'senha', mensagem: 'E-mail ou senha incorretos.' };

    const admin = ADMINISTRADORES[email];
    const sessao: Sessao = admin
      ? { email, nome: admin.nome, cargo: admin.cargo, perfil: 'admin' }
      : { email, nome: this.nomeDoEmail(email), cargo: 'Colaborador', perfil: 'colaborador' };
    return { ok: true, sessao };
  }

  iniciar(sessao: Sessao, manterConectado: boolean) {
    this.limpar();
    const armazenamento = manterConectado ? localStorage : sessionStorage;
    try { armazenamento.setItem(this.CHAVE, JSON.stringify(sessao)); } catch { /* sem armazenamento */ }
    this.sessao.set(sessao);
  }

  sair() {
    this.limpar();
    this.sessao.set(null);
  }

  estaLogado() { return this.sessao() !== null; }
  ehAdmin() { return this.sessao()?.perfil === 'admin'; }

  private limpar() {
    for (const s of [localStorage, sessionStorage]) {
      try {
        s.removeItem(this.CHAVE);
        // Chaves da versão anterior (sem perfil) — removidas para não "vazar" acesso
        s.removeItem('usuarioLogado');
        s.removeItem('itsentinel.email');
      } catch { /* ignore */ }
    }
  }

  private carregar(): Sessao | null {
    for (const s of [localStorage, sessionStorage]) {
      try {
        const bruto = s.getItem(this.CHAVE);
        if (!bruto) continue;
        const sessao = JSON.parse(bruto) as Sessao;
        if (sessao?.email && (sessao.perfil === 'admin' || sessao.perfil === 'colaborador')) {
          // Nunca confia no perfil salvo: recalcula pela lista de administradores
          const admin = ADMINISTRADORES[sessao.email];
          return admin
            ? { ...sessao, nome: admin.nome, cargo: admin.cargo, perfil: 'admin' }
            : { ...sessao, perfil: 'colaborador', cargo: 'Colaborador' };
        }
      } catch { /* ignore */ }
    }
    return null;
  }

  /** "maria.souza@..." -> "Maria Souza" */
  nomeDoEmail(email: string) {
    return email.split('@')[0].split(/[._-]+/).filter(Boolean)
      .map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
  }
}
