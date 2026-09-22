import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core'; // Importei o 'ChangeDetectorRef'
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink], 
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit, OnDestroy {
  slideAtual = 0;
  intervalId: any;

  // Variáveis para controlar o nível de zoom da fonte e o alto contraste
  nivelFonte = 0; 
  altoContrasteAtivo = false;

  slides = [
    {
      tag: 'IT SENTINEL',
      titulo: 'Seu ambiente de TI, sempre um passo à frente.',
      texto: 'Uma plataforma criada para ajudar empresas a acompanhar seus equipamentos de tecnologia e identificar sinais de problemas.',
      imagem: 'imagens/umpassoafrente.png',
      alt: 'Gestão de tecnologia da empresa'
    },
    {
      tag: 'GESTÃO DE TI',
      titulo: 'Tenha uma visão organizada dos seus equipamentos.',
      texto: 'O IT Sentinel permite acompanhar informações dos equipamentos e seu histórico dentro do ambiente de tecnologia da empresa.',
      imagem: 'imagens/sentinel-equipamentos.png',
      alt: 'Acompanhamento dos equipamentos de TI'
    },
    {
      tag: 'AÇÃO PREVENTIVA',
      titulo: 'Identifique sinais antes que o problema aconteça.',
      texto: 'O objetivo é ajudar a equipe de TI a perceber sinais de problemas e agir de forma preventiva, evitando interrupções.',
      imagem: 'imagens/acaopreventiva.png',
      alt: 'Ação preventiva em equipamentos de TI'
    }
  ];

  // <-- o 'constructor' para o Angular saber que vai usar o atualizador de tela
  constructor(private cdr: ChangeDetectorRef) {}

  // Quando a página abre, liga o carrossel automático
  ngOnInit() {
    this.iniciarAutoPlay();
  }

  // Quando sai da página, desliga o relógio para economizar memória
  ngOnDestroy() {
    this.pararAutoPlay();
  }

  iniciarAutoPlay() {
    // Troca de slide a cada 6 segundos para dar tempo de leitura
    this.intervalId = setInterval(() => {
      this.proximoSlide();
      
      // <-- "cutuca" o navegador e força a imagem a mudar sozinha.
      this.cdr.detectChanges(); 
    }, 6000); 
  }

  pararAutoPlay() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  // Reseta o tempo se clicar manualmente nas setas ou bolinhas
  reiniciarAutoPlay() {
    this.pararAutoPlay();
    this.iniciarAutoPlay();
  }

  proximoSlide() {
    this.slideAtual = (this.slideAtual + 1) % this.slides.length;
  }

  slideAnterior() {
    this.slideAtual = (this.slideAtual - 1 + this.slides.length) % this.slides.length;
    this.reiniciarAutoPlay();
  }

  avancarManual() {
    this.proximoSlide();
    this.reiniciarAutoPlay();
  }

  irParaSlide(index: number) {
    this.slideAtual = index;
    this.reiniciarAutoPlay();
  }

  // FUNÇÕES DE ACESSIBILIDADE 

  aumentarFonte() {
    if (this.nivelFonte < 2) {
      this.nivelFonte++;
      this.aplicarAcessibilidade();
    }
  }

  diminuirFonte() {
    if (this.nivelFonte > 0) {
      this.nivelFonte--;
      this.aplicarAcessibilidade();
    }
  }

  alternarContraste() {
    this.altoContrasteAtivo = !this.altoContrasteAtivo;
    this.aplicarAcessibilidade();
  }

  aplicarAcessibilidade() {
    const body = document.body;
    
    // Controla o tamanho da fonte globalmente
    body.classList.remove('fonte-grande', 'fonte-maior');
    if (this.nivelFonte === 1) body.classList.add('fonte-grande');
    if (this.nivelFonte === 2) body.classList.add('fonte-maior');

    // Controla o alto contraste
    if (this.altoContrasteAtivo) {
      body.classList.add('alto-contraste');
    } else {
      body.classList.remove('alto-contraste');
    }
  }

  ativarLibras() {
    // Abre a página oficial do VLibras em nova aba
    window.open('https://www.gov.br/governodigital/pt-br/vlibras', '_blank');
  }
}
