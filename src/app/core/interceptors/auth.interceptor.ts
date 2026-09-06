import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthService } from '../services/auth.service';

/**
 * Anexa o token de autenticação apenas nas chamadas feitas para a nossa API,
 * sem afetar requisições a outros domínios.
 */
export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  if (token && request.url.startsWith(environment.apiUrl)) {
    request = request.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  return next(request);
};
