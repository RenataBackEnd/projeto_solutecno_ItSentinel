import { Component, OnInit, OnDestroy, ChangeDetectorRef, HostListener, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Icone } from '../../components/icone/icone';
import { BarraAcessibilidade } from '../../components/barra-acessibilidade/barra-acessibilidade';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, Icone, BarraAcessibilidade],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit, OnDestroy {
  slideAtual = 0;
  intervalId: any;
  anoAtual = new Date().getFullYear();

  // Menu do celular/tablet
  menuAberto = signal(false);

  // Pausa manual (botão) e pausa temporária (mouse/foco sobre o carrossel)
  pausadoPeloUsuario = false;
  private pausadoTemporario = false;

  slides = [
    {
      tag: 'IT Sentinel',
      titulo: 'Seu ambiente de TI, sempre um passo à frente.',
      texto: 'Uma plataforma criada para ajudar empresas a acompanhar seus equipamentos de tecnologia e identificar sinais de problemas.',
      imagem: 'imagens/umpassoafrente.webp',
      alt: 'Escritório moderno com equipe trabalhando em computadores'
    },
    {
      tag: 'Gestão de TI',
      titulo: 'Tenha uma visão organizada dos seus equipamentos.',
      texto: 'O IT Sentinel permite acompanhar informações dos equipamentos e seu histórico dentro do ambiente de tecnologia da empresa.',
      imagem: 'imagens/sentinel-equipamentos.webp',
      alt: 'Acompanhamento dos equipamentos de TI'
    },
    {
      tag: 'Ação preventiva',
      titulo: 'Identifique sinais antes que o problema aconteça.',
      texto: 'O objetivo é ajudar a equipe de TI a perceber sinais de problemas e agir de forma preventiva, evitando interrupções.',
      imagem: 'imagens/acaopreventiva.webp',
      alt: 'Técnico realizando manutenção preventiva em equipamento de TI'
    }
  ];

  // Cartões da seção "Como funciona"
  recursos = [
    { icone: 'atividade', titulo: 'Monitoramento contínuo', texto: 'Acompanhe a saúde de cada equipamento em um só painel, com status claros de atenção e risco.' },
    { icone: 'historico', titulo: 'Histórico centralizado', texto: 'Chamados, problemas e manutenções ficam registrados e fáceis de consultar.' },
    { icone: 'escudo', titulo: 'Ação preventiva', texto: 'Identifique sinais de falha cedo e priorize o que pode impactar a operação.' },
  ];

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    // Quem prefere menos movimento não recebe rotação automática
    const reduzirMovimento = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduzirMovimento) {
      this.pausadoPeloUsuario = true;
    } else {
      this.iniciarAutoPlay();
    }
  }

  ngOnDestroy() {
    this.pararAutoPlay();
  }

  // Fecha o menu do celular com Esc
  @HostListener('document:keydown.escape')
  fecharMenu() {
    this.menuAberto.set(false);
  }

  iniciarAutoPlay() {
    this.pararAutoPlay();
    if (this.pausadoPeloUsuario || this.pausadoTemporario) return;
    // Troca de slide a cada 7 segundos para dar tempo de leitura
    this.intervalId = setInterval(() => {
      this.proximoSlide();
      this.cdr.detectChanges();
    }, 7000);
  }

  pararAutoPlay() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  pausarTemporariamente(pausar: boolean) {
    this.pausadoTemporario = pausar;
    pausar ? this.pararAutoPlay() : this.iniciarAutoPlay();
  }

  alternarPausa() {
    this.pausadoPeloUsuario = !this.pausadoPeloUsuario;
    this.pausadoPeloUsuario ? this.pararAutoPlay() : this.iniciarAutoPlay();
  }

  proximoSlide() {
    this.slideAtual = (this.slideAtual + 1) % this.slides.length;
  }

  slideAnterior() {
    this.slideAtual = (this.slideAtual - 1 + this.slides.length) % this.slides.length;
    this.iniciarAutoPlay();
  }

  avancarManual() {
    this.proximoSlide();
    this.iniciarAutoPlay();
  }

  irParaSlide(index: number) {
    this.slideAtual = index;
    this.iniciarAutoPlay();
  }
}
