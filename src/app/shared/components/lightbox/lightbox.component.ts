import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventPhoto } from '../../../core/models/event.model';

/**
 * Visualizador de fotos em tela cheia, usado na página pública do evento.
 * Não sabe nada sobre de onde as fotos vieram — apenas as exibe.
 */
@Component({
  selector: 'app-lightbox',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lightbox.component.html',
  styleUrl: './lightbox.component.css'
})
export class LightboxComponent {
  @Input({ required: true }) photos: EventPhoto[] = [];
  @Input() index = 0;
  @Output() closed = new EventEmitter<void>();

  @HostListener('document:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.close();
    } else if (event.key === 'ArrowRight') {
      this.next();
    } else if (event.key === 'ArrowLeft') {
      this.prev();
    }
  }

  get current(): EventPhoto | undefined {
    return this.photos[this.index];
  }

  next(): void {
    this.index = (this.index + 1) % this.photos.length;
  }

  prev(): void {
    this.index = (this.index - 1 + this.photos.length) % this.photos.length;
  }

  close(): void {
    this.closed.emit();
  }
}
