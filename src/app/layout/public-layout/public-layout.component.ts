import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { WhatsappButtonComponent } from '../../shared/components/whatsapp-button/whatsapp-button.component';

/**
 * Layout usado por todas as páginas públicas (visitante do site).
 * Mantém navbar/rodapé/botão de WhatsApp fora do painel administrativo.
 */
@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, WhatsappButtonComponent],
  template: `
    <app-navbar></app-navbar>
    <main>
      <router-outlet></router-outlet>
    </main>
    <app-footer></app-footer>
    <app-whatsapp-button></app-whatsapp-button>
  `
})
export class PublicLayoutComponent {}
