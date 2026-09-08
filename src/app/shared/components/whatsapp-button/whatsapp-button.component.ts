import { Component } from '@angular/core';
import { WHATSAPP_URL } from '../../constants/contact';

/**
 * Botão flutuante de contato via WhatsApp, visível em todas as páginas
 * públicas (incluído no PublicLayoutComponent). Não sabe nada sobre o
 * restante do site — só expõe o link já pronto com a mensagem padrão.
 */
@Component({
  selector: 'app-whatsapp-button',
  standalone: true,
  templateUrl: './whatsapp-button.component.html',
  styleUrl: './whatsapp-button.component.css'
})
export class WhatsappButtonComponent {
  readonly whatsappUrl = WHATSAPP_URL;
}
