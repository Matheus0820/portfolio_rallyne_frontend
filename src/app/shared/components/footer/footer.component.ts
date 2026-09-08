import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { WHATSAPP_PHONE_DISPLAY, WHATSAPP_URL } from '../../constants/contact';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  readonly year = new Date().getFullYear();
  readonly whatsappUrl = WHATSAPP_URL;
  readonly whatsappDisplay = WHATSAPP_PHONE_DISPLAY;
}
