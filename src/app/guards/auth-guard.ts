import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { ToastService } from '../services/toast';

/**
 * Protege o Dashboard: somente ADMINISTRADORES entram.
 * Nunca redireciona "em silêncio" — sempre explica o motivo com um aviso.
 */
export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const auth = inject(AuthService);
  const toast = inject(ToastService);

  if (auth.ehAdmin()) return true;

  if (auth.estaLogado()) {
    // Logado, mas como colaborador: leva para a área de chamados
    toast.erro('Acesso restrito ao administrador',
      'Seu perfil não tem acesso ao Dashboard. Você pode abrir e acompanhar seus chamados aqui.');
    return router.createUrlTree(['/chamado']);
  }

  toast.info('Faça login para continuar', 'O Dashboard é restrito ao administrador de TI.');
  return router.createUrlTree(['/login']);
};
