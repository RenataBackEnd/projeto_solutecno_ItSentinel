import { Routes } from '@angular/router';
import { Login } from './pages/login/login'; // Importa a página de Login
import { Home } from './pages/home/home'; // Importa a página Home
import { Dashboard } from './pages/dashboard/dashboard'; // Importa a página Dashboard

export const routes: Routes = [
  // Rota para o Login
  { path: 'login', component: Login },
  
  // Rota para a Home
  { path: 'home', component: Home },
  
  // Rota para o Dashboard
  { path: 'dashboard', component: Dashboard },
  
  // Quando abrir localhost:4200 vazio, joga para o login
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  
  // Rota de segurança: se o usuário digitar um endereço que não existe, joga pro login
  { path: '**', redirectTo: 'login' }
];
