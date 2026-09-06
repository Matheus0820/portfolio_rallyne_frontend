import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EventService } from '../../../core/services/event.service';
import { PortfolioEvent } from '../../../core/models/event.model';

@Component({
  selector: 'app-portfolio-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './portfolio-list.component.html',
  styleUrl: './portfolio-list.component.css'
})
export class PortfolioListComponent implements OnInit {
  readonly events = signal<PortfolioEvent[]>([]);
  readonly loading = signal(true);
  readonly errorMessage = signal<string | null>(null);

  constructor(private readonly eventService: EventService) {}

  ngOnInit(): void {
    this.eventService.list().subscribe({
      next: (events) => {
        this.events.set(events);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Não foi possível carregar o portfólio agora. Tente novamente em instantes.');
        this.loading.set(false);
      }
    });
  }

  cover(event: PortfolioEvent): string | null {
    const first = event.photos[0];
    return first ? this.eventService.resolvePhotoUrl(first.url) : null;
  }
}
