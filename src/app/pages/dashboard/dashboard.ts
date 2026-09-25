import { Component, ElementRef, HostListener, OnDestroy, ViewChild, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Chamado, ChamadoService, Etapa, INFO_ETAPA, MOTIVOS_IMPREVISTO } from '../../services/chamado';
import { AuthService } from '../../services/auth';
import { ToastService } from '../../services/toast';
import { SessaoAcoes } from '../../services/sessao-acoes';
import { Icone } from '../../components/icone/icone';
import { BarraAcessibilidade } from '../../components/barra-acessibilidade/barra-acessibilidade';
import { LinhaTempo } from '../../components/linha-tempo/linha-tempo';

type Painel = 'relatorio' | 'inventario' | null;
type Filtro = 'abertos' | 'resolvidos' | 'todos';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, FormsModule, DatePipe, Icone, BarraAcessibilidade, LinhaTempo],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnDestroy {
  private chamadoService = inject(ChamadoService);
  private auth = inject(AuthService);
  private toast = inject(ToastService);
  private sessaoAcoes = inject(SessaoAcoes);

  protected readonly INFO_ETAPA = INFO_ETAPA;
  protected readonly MOTIVOS = MOTIVOS_IMPREVISTO;
  protected readonly etapasResumo: Etapa[] = ['aberto', 'em-analise', 'em-atendimento', 'impedido', 'resolvido'];

  // Usuário logado (admin)
  sessao = this.auth.sessao;
  primeiroNome = computed(() => this.sessao()?.nome.split(' ')[0] ?? '');
  iniciais = computed(() => (this.sessao()?.nome ?? '?').split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase());

  // Chamados em tempo real
  private chamados = toSignal(this.chamadoService.chamados$, { initialValue: this.chamadoService.getChamados() });
  get listaMaquinas(): Chamado[] { return this.chamados(); }
  private emAberto = computed(() => this.chamados().filter(c => c.etapa !== 'resolvido'));
  get qtdAtencao() { return this.emAberto().filter(m => m.status === 'Atenção').length; }
  get qtdCritico() { return this.emAberto().filter(m => m.status === 'Crítico').length; }
  indiceSaude = 91;

  // Busca e filtro
  termoBusca = '';
  filtro: Filtro = 'abertos';
  filtros: { valor: Filtro; rotulo: string }[] = [
    { valor: 'abertos', rotulo: 'Em aberto' },
    { valor: 'resolvidos', rotulo: 'Resolvidos' },
    { valor: 'todos', rotulo: 'Todos' },
  ];

  // Menu lateral no celular
  menuAberto = false;

  // Gaveta lateral (relatório / inventário)
  painelAberto: Painel = null;
  private idSelecionado = signal<string | null>(null);
  chamadoSelecionado = computed(() => this.chamados().find(c => c.id === this.idSelecionado()) ?? null);
  mostrarImprevisto = false;
  motivoImprevisto = MOTIVOS_IMPREVISTO[0];
  private elementoQueAbriu: HTMLElement | null = null;

  @ViewChild('botaoFechar') botaoFechar?: ElementRef<HTMLButtonElement>;
  @ViewChild('painel') painel?: ElementRef<HTMLElement>;

  anoAtual = new Date().getFullYear();
  dataHoje = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: '2-digit', month: 'short', year: 'numeric' })
    .format(new Date()).replace('.', '');
  saudacao = this.calcularSaudacao();
  previsaoSolucao = this.calcularPrevisao();

  get maquinasFiltradas(): Chamado[] {
    const termo = this.normalizar(this.termoBusca);
    return this.porFiltro(this.filtro).filter(m => !termo ||
      this.normalizar([m.id, m.nome, m.status, INFO_ETAPA[m.etapa].titulo, m.problema, m.nomeUsuario, m.setorUsuario].join(' ')).includes(termo));
  }

  contar(f: Filtro) { return this.porFiltro(f).length; }
  contarEtapa(e: Etapa) { return this.chamados().filter(c => c.etapa === e).length; }

  private porFiltro(f: Filtro) {
    const todos = this.chamados();
    if (f === 'abertos') return todos.filter(c => c.etapa !== 'resolvido');
    if (f === 'resolvidos') return todos.filter(c => c.etapa === 'resolvido');
    return todos;
  }

  iconeMaquina(nome: string) {
    return /impressora/i.test(nome) ? 'impressora' : 'monitor';
  }

  // ----- GAVETA LATERAL -----
  abrirPainel(tipo: Painel, evento?: Event) {
    this.elementoQueAbriu = (evento?.currentTarget as HTMLElement) ?? null;
    this.menuAberto = false;
    this.painelAberto = tipo;
    document.body.classList.add('gaveta-aberta');
    this.mostrarImprevisto = false;
    setTimeout(() => this.botaoFechar?.nativeElement.focus());
  }

  verDiagnostico(chamado: Chamado, evento: Event) {
    this.idSelecionado.set(chamado.id);
    this.abrirPainel('relatorio', evento);
  }

  selecionar(chamado: Chamado | null) {
    this.idSelecionado.set(chamado?.id ?? null);
    this.mostrarImprevisto = false;
    setTimeout(() => this.painel?.nativeElement.querySelector<HTMLElement>('.corpo-painel button')?.focus());
  }

  fecharPainel() {
    this.painelAberto = null;
    document.body.classList.remove('gaveta-aberta');
    this.idSelecionado.set(null);
    this.mostrarImprevisto = false;
    setTimeout(() => this.elementoQueAbriu?.focus());
  }

  // ----- AÇÕES DO ADMINISTRADOR SOBRE O CHAMADO -----
  proximaEtapa(c: Chamado) { return this.chamadoService.proximaEtapa(c); }

  avancar(c: Chamado) {
    const atualizado = this.chamadoService.avancar(c.id);
    if (!atualizado) return;
    if (atualizado.etapa === 'resolvido') {
      this.toast.sucesso('Chamado concluído', `${c.id} — “${c.nome}” foi resolvido e saiu da lista de atenção.`);
    } else {
      this.toast.info('Etapa atualizada', `${c.id} agora está em “${INFO_ETAPA[atualizado.etapa].titulo}”.`);
    }
  }

  relatarImprevisto(c: Chamado) {
    this.chamadoService.relatarImprevisto(c.id, this.motivoImprevisto);
    this.mostrarImprevisto = false;
    this.toast.alerta('Imprevisto registrado', `${c.id}: ${this.motivoImprevisto}. O solicitante verá o aviso em “Meus chamados”.`);
  }

  retomar(c: Chamado) {
    this.chamadoService.retomar(c.id);
    this.toast.info('Atendimento retomado', `${c.id} voltou para a etapa em que estava.`);
  }

  reabrir(c: Chamado) {
    this.chamadoService.reabrir(c.id);
    this.toast.alerta('Chamado reaberto', `${c.id} voltou para “Em análise”.`);
  }

  @HostListener('document:keydown.escape')
  aoPressionarEsc() {
    if (document.querySelector('dialog[open]')) return; // a confirmação trata o próprio Esc
    if (this.painelAberto) this.fecharPainel();
    else if (this.menuAberto) this.menuAberto = false;
  }

  prenderFoco(evento: KeyboardEvent) {
    if (evento.key !== 'Tab' || !this.painel) return;
    const focaveis = this.painel.nativeElement.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (!focaveis.length) return;
    const primeiro = focaveis[0];
    const ultimo = focaveis[focaveis.length - 1];
    if (evento.shiftKey && document.activeElement === primeiro) { ultimo.focus(); evento.preventDefault(); }
    else if (!evento.shiftKey && document.activeElement === ultimo) { primeiro.focus(); evento.preventDefault(); }
  }

  ngOnDestroy() {
    document.body.classList.remove('gaveta-aberta');
  }

  /** Pede confirmação antes de encerrar a sessão */
  sair() {
    this.menuAberto = false;
    this.sessaoAcoes.sair('/home');
  }

  private calcularSaudacao() {
    const hora = new Date().getHours();
    if (hora < 12) return { texto: 'Bom dia', icone: 'sol' };
    if (hora < 18) return { texto: 'Boa tarde', icone: 'sol' };
    return { texto: 'Boa noite', icone: 'lua' };
  }

  private calcularPrevisao() {
    const fmt = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' });
    const hoje = new Date();
    const fim = new Date(hoje);
    fim.setDate(hoje.getDate() + 2);
    return `${fmt.format(hoje)} – ${fmt.format(fim)}`.replace(/\./g, '');
  }

  private normalizar(texto: string) {
    return (texto || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
  }
}
