import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  // Router para poder redirecionar o usuário
  const router = inject(Router);
  
  // verifica se o usuário está logado.   
  const usuarioLogado = localStorage.getItem('usuarioLogado');

  if (usuarioLogado === 'true') {
    // Se tem a credencial, a porta abre (retorna true)
    return true;
  } else {
    // Se não tem, ele é barrado e mandado de volta pro login
    router.navigate(['/home']);
    return false;
  }
};