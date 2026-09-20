import { Component, OnInit, OnDestroy } from '@angular/core';
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

  slides = [
    {
      tag: 'IT SENTINEL',
      titulo: 'Seu ambiente de TI, sempre um passo à frente.',
      texto: 'Uma plataforma criada para ajudar empresas a acompanhar seus equipamentos de tecnologia e identificar sinais de problemas.',
      imagem: 'imagens/imagem base.png',
      alt: 'Gestão de tecnologia da empresa'
    },
    {
      tag: 'GESTÃO DE TI',
      titulo: 'Tenha uma visão organizada dos seus equipamentos.',
      texto: 'O IT Sentinel permite acompanhar informações dos equipamentos e seu histórico dentro do ambiente de tecnologia da empresa.',
      imagem: 'imagens/imagem base.png',
      alt: 'Acompanhamento dos equipamentos de TI'
    },
    {
      tag: 'AÇÃO PREVENTIVA',
      titulo: 'Identifique sinais antes que o problema aconteça.',
      texto: 'O objetivo é ajudar a equipe de TI a perceber sinais de problemas e agir de forma preventiva, evitando interrupções.',
      imagem: 'imagens/imagem base.png',
      alt: 'Ação preventiva em equipamentos de TI'
    }
  ];

  // Quando a página abre, liga o carrossel automático
  ngOnInit() {
    this.iniciarAutoPlay();
  }

  // Quando sai da página, desliga o relógio para economizar memória
  ngOnDestroy() {
    this.pararAutoPlay();
  }

  iniciarAutoPlay() {
    // Troca de slide a cada 4 segundos (4000 milissegundos)
    this.intervalId = setInterval(() => {
      this.proximoSlide();
    }, 1000);
  }

  pararAutoPlay() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  // Reseta o tempo se você clicar manualmente nas setas ou bolinhas
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
}