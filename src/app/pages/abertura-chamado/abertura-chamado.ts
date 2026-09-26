import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { Chamado, ChamadoService, INFO_ETAPA, MOTIVOS_IMPREVISTO, Prioridade } from '../../services/chamado';
import { AuthService } from '../../services/auth';
import { ToastService } from '../../services/toast';
import { SessaoAcoes } from '../../services/sessao-acoes';
import { Icone } from '../../components/icone/icone';
import { BarraAcessibilidade } from '../../components/barra-acessibilidade/barra-acessibilidade';
import { LinhaTempo } from '../../components/linha-tempo/linha-tempo';

type Tela = 'novo' | 'confirmacao' | 'meus';

@Component({
  selector: 'app-abertura-chamado',
  standalone: true,
  imports: [FormsModule, RouterLink, DatePipe, Icone, BarraAcessibilidade, LinhaTempo],
  templateUrl: './abertura-chamado.html',
  styleUrls: ['./abertura-chamado.css']
})
export class AberturaChamadoComponent {
  private chamados = inject(ChamadoService);
  protected auth = inject(AuthService);
  private toast = inject(ToastService);
  private sessaoAcoes = inject(SessaoAcoes);
  private router = inject(Router);
  private rota = inject(ActivatedRoute);

  protected readonly INFO_ETAPA = INFO_ETAPA;

  // ---------- Identificação (mesmas regras do login) 
  emailUsuario = '';
  senhaUsuario = '';
  mostrarSenha = false;
  manterConectado = false;
  errosLogin = { email: '', senha: '' };

  // ---------- Formulário do chamado ----------
  nomeMaquina = '';
  statusSelecionado: Prioridade = 'Atenção';
  descricaoProblema = '';
  setorSolicitante = '';
  erros = { maquina: '', descricao: '' };

  // ---------- Navegação entre telas ----------
  tela = signal<Tela>('novo');
  ultimoChamadoId = signal<string | null>(null);
  expandido = signal<string | null>(null);

  sessao = this.auth.sessao;
  private todos = toSignal(this.chamados.chamados$, { initialValue: this.chamados.getChamados() });
  meusChamados = computed(() => {
    const email = this.sessao()?.email;
    return email ? this.todos().filter(c => c.emailUsuario === email) : [];
  });
  ultimoChamado = computed(() => this.todos().find(c => c.id === this.ultimoChamadoId()) ?? null);

  constructor() {
    // Permite abrir direto em "Meus chamados": /chamado?aba=meus
    if (this.rota.snapshot.queryParamMap.get('aba') === 'meus' && this.sessao()) this.tela.set('meus');
  }

  // ===== ETAPA 1: identificação =====
  fazerLoginUsuario() {
    this.errosLogin = { email: '', senha: '' };
    const r = this.auth.validar(this.emailUsuario, this.senhaUsuario);
    if (!r.ok) this.errosLogin[r.campo] = r.mensagem;

    if (!r.ok) {
      this.toast.erro('Não foi possível continuar', 'Revise os campos destacados.');
      this.focar(this.errosLogin.email ? 'chamado-email' : 'chamado-senha');
      return;
    }

    this.auth.iniciar(r.sessao, this.manterConectado);
    this.senhaUsuario = '';
    this.toast.sucesso(`Olá, ${r.sessao.nome}!`, 'Identificação confirmada. Agora descreva o problema.');
    this.irPara('novo', 'setor');
  }

  // ===== ETAPA 2: registrar =====
  enviarChamado() {
    const s = this.sessao();
    if (!s) return;
    this.erros.maquina = this.nomeMaquina.trim() ? '' : 'Informe qual equipamento está com problema.';
    this.erros.descricao = this.descricaoProblema.trim().length >= 10 ? '' : 'Descreva o problema com pelo menos 10 caracteres.';

    if (this.erros.maquina || this.erros.descricao) {
      this.toast.erro('Faltam informações', 'Preencha os campos destacados para registrar o chamado.');
      this.focar(this.erros.maquina ? 'maquina' : 'descricao');
      return;
    }

    const novo = this.chamados.abrirChamado({
      nome: this.nomeMaquina.trim(),
      status: this.statusSelecionado,
      problema: this.descricaoProblema.trim(),
      nomeUsuario: s.nome,
      emailUsuario: s.email,
      setorUsuario: this.setorSolicitante.trim(),
    });

    this.toast.sucesso('Chamado registrado com sucesso!', `Protocolo ${novo.id}. A equipe de TI já foi notificada.`);
    this.nomeMaquina = '';
    this.descricaoProblema = '';
    this.statusSelecionado = 'Atenção';

    // Leva o usuário para a TELA DE CONFIRMAÇÃO (etapa 3)
    this.ultimoChamadoId.set(novo.id);
    this.irPara('confirmacao', 'titulo-confirmacao');
  }

  // ===== Navegação =====
  irPara(tela: Tela, foco?: string) {
    this.tela.set(tela);
    window.scrollTo({ top: 0 });
    if (foco) this.focar(foco);
  }

  acompanhar(id: string) {
    this.expandido.set(id);
    this.irPara('meus', 'item-' + id);
  }

  alternar(id: string) {
    this.expandido.update(atual => (atual === id ? null : id));
  }

  sair() {
    this.sessaoAcoes.sair('/chamado');
  }

  // ===== MODO DEMONSTRAÇÃO: simula a equipe de TI trabalhando no chamado =====
  proximaEtapa(c: Chamado) { return this.chamados.proximaEtapa(c); }

  demoAvancar(c: Chamado) {
    const atualizado = this.chamados.avancar(c.id);
    if (!atualizado) return;
    if (atualizado.etapa === 'resolvido') {
      this.toast.sucesso('Chamado resolvido!', `${c.id}: “${c.nome}” voltou a funcionar. Obrigado pela paciência.`);
    } else {
      this.toast.info(`Atualização no chamado ${c.id}`, `Nova etapa: ${INFO_ETAPA[atualizado.etapa].titulo}.`);
    }
  }

  demoImprevisto(c: Chamado) {
    const motivo = MOTIVOS_IMPREVISTO[Math.floor(Math.random() * MOTIVOS_IMPREVISTO.length)];
    this.chamados.relatarImprevisto(c.id, motivo);
    this.toast.alerta(`Imprevisto no chamado ${c.id}`, `${motivo}. A equipe avisará quando o atendimento for retomado.`);
  }

  demoRetomar(c: Chamado) {
    this.chamados.retomar(c.id);
    this.toast.info(`Chamado ${c.id} retomado`, 'O imprevisto foi resolvido e o atendimento continua.');
  }

  demoReabrir(c: Chamado) {
    this.chamados.reabrir(c.id);
    this.toast.alerta(`Chamado ${c.id} reaberto`, 'O problema voltou? A equipe fará uma nova análise.');
  }

  private focar(id: string) {
    setTimeout(() => document.getElementById(id)?.focus(), 50);
  }
}
