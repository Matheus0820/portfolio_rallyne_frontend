import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EventService } from '../../../core/services/event.service';
import { PortfolioEvent } from '../../../core/models/event.model';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.css'
})
export class EventListComponent implements OnInit {
  readonly events = signal<PortfolioEvent[]>([]);
  readonly loading = signal(true);
  readonly deletingId = signal<string | null>(null);

  constructor(private readonly eventService: EventService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);

    this.eventService.list().subscribe({
      next: (events) => {
        this.events.set(events);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  cover(event: PortfolioEvent): string | null {
    const first = event.photos[0];

    return first
      ? this.eventService.resolvePhotoUrl(first.url)
      : null;
  }

  remove(event: PortfolioEvent): void {
    const confirmed = confirm(
      `Excluir o evento "${event.title}" e todas as suas fotos?`
    );

    if (!confirmed) {
      return;
    }

    this.deletingId.set(event.id);

    this.eventService.delete(event.id).subscribe({
      next: () => {
        this.events.update((list) =>
          list.filter((item) => item.id !== event.id)
        );

        this.deletingId.set(null);
      },
      error: () => {
        this.deletingId.set(null);
      }
    });
  }
}
