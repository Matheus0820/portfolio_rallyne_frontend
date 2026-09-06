import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EventService } from '../../../core/services/event.service';
import { EventPhoto, PortfolioEvent } from '../../../core/models/event.model';
import { LightboxComponent } from '../../../shared/components/lightbox/lightbox.component';

@Component({
  selector: 'app-portfolio-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, LightboxComponent],
  templateUrl: './portfolio-detail.component.html',
  styleUrl: './portfolio-detail.component.css'
})
export class PortfolioDetailComponent implements OnInit {
  readonly event = signal<PortfolioEvent | null>(null);
  readonly loading = signal(true);
  readonly notFound = signal(false);
  readonly lightboxIndex = signal<number | null>(null);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly eventService: EventService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.notFound.set(true);
      this.loading.set(false);
      return;
    }

    this.eventService.getById(id).subscribe({
      next: (event) => {
        this.event.set(event);
        this.loading.set(false);
      },
      error: () => {
        this.notFound.set(true);
        this.loading.set(false);
      }
    });
  }

  photoUrl(photo: EventPhoto): string {
    return this.eventService.resolvePhotoUrl(photo.url);
  }

  resolvedPhotos(): EventPhoto[] {
    const event = this.event();
    if (!event) {
      return [];
    }
    return event.photos.map((photo) => ({ ...photo, url: this.photoUrl(photo) }));
  }

  openLightbox(index: number): void {
    this.lightboxIndex.set(index);
  }

  closeLightbox(): void {
    this.lightboxIndex.set(null);
  }
}
