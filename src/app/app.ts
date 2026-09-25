import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PreferenciasService } from './services/preferencias';
import { Toasts } from './components/toast/toast';
import { DialogoConfirmacao } from './components/dialogo-confirmacao/dialogo-confirmacao';

@Component({
  imports: [RouterOutlet, Toasts, DialogoConfirmacao],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  // Injetado aqui para aplicar tema e tamanho de fonte em TODAS as páginas
  private readonly preferencias = inject(PreferenciasService);
}
