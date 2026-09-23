import { Routes } from '@angular/router';
import { Login } from './pages/login/login'; // Importa a página de Login
import { Home } from './pages/home/home'; // Importa a página Home
import { Dashboard } from './pages/dashboard/dashboard'; // Importa a página Dashboard
import { AberturaChamadoComponent } from './pages/abertura-chamado/abertura-chamado';

export const routes: Routes = [
  // Rota para o Login
  { path: 'login', component: Login },
  
  // Rota para a Home
  { path: 'home', component: Home },

  { path: 'chamado', component: AberturaChamadoComponent }, // Rots chamado
  
  // Rota para o Dashboard
  { path: 'dashboard', component: Dashboard },
  
  // Quando abrir localhost:4200 vazio, joga para a HOME
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  
  // Rota de segurança: se o usuário digitar um endereço que não existe, joga pra HOME
  { path: '**', redirectTo: 'home' }
];