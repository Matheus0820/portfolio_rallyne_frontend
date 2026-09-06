import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EventService } from '../../core/services/event.service';
import { PortfolioEvent } from '../../core/models/event.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  readonly recentEvents = signal<PortfolioEvent[]>([]);
  readonly loading = signal(true);

  constructor(private readonly eventService: EventService) {}

  ngOnInit(): void {
    this.eventService.list().subscribe({
      next: (events) => {
        this.recentEvents.set(events.slice(0, 3));
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  cover(event: PortfolioEvent): string | null {
    const first = event.photos[0];
    return first ? this.eventService.resolvePhotoUrl(first.url) : null;
  }
}
