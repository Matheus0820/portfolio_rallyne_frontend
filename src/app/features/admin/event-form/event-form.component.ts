import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EventService } from '../../../core/services/event.service';
import { EventPhoto, PortfolioEvent } from '../../../core/models/event.model';

interface PhotoPreview {
  file: File;
  url: string;
}

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './event-form.component.html',
  styleUrl: './event-form.component.css'
})
export class EventFormComponent implements OnInit {
  readonly eventId = signal<string | null>(null);
  readonly existingPhotos = signal<EventPhoto[]>([]);
  readonly newPhotos = signal<PhotoPreview[]>([]);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly removingPhotoId = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    title: ['', [Validators.required]],
    location: ['', [Validators.required]],
    date: ['', [Validators.required]],
    description: ['']
  });

  get isEditMode(): boolean {
    return this.eventId() !== null;
  }

  constructor(
    private readonly fb: FormBuilder,
    private readonly eventService: EventService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      return;
    }

    this.eventId.set(id);
    this.loading.set(true);
    this.eventService.getById(id).subscribe({
      next: (event) => {
        this.populateForm(event);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Não foi possível carregar este evento.');
        this.loading.set(false);
      }
    });
  }

  private populateForm(event: PortfolioEvent): void {
    this.form.patchValue({
      title: event.title,
      location: event.location,
      date: event.date?.slice(0, 10) ?? '',
      description: event.description ?? ''
    });
    this.existingPhotos.set(event.photos);
  }

  onFilesSelected(input: HTMLInputElement): void {
    const files = Array.from(input.files ?? []);
    const previews = files.map((file) => ({ file, url: URL.createObjectURL(file) }));
    this.newPhotos.update((current) => [...current, ...previews]);
    input.value = '';
  }

  removeNewPhoto(index: number): void {
    this.newPhotos.update((current) => {
      const copy = [...current];
      const [removed] = copy.splice(index, 1);
      if (removed) {
        URL.revokeObjectURL(removed.url);
      }
      return copy;
    });
  }

  removeExistingPhoto(photo: EventPhoto): void {
    const id = this.eventId();
    if (!id) {
      return;
    }

    const confirmed = confirm('Remover esta foto do evento?');
    if (!confirmed) {
      return;
    }

    this.removingPhotoId.set(photo.id);
    this.eventService.deletePhoto(id, photo.id).subscribe({
      next: (updatedEvent) => {
        this.existingPhotos.set(updatedEvent.photos);
        this.removingPhotoId.set(null);
      },
      error: () => this.removingPhotoId.set(null)
    });
  }

  photoUrl(photo: EventPhoto): string {
    return this.eventService.resolvePhotoUrl(photo.url);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.errorMessage.set(null);
    const payload = this.form.getRawValue();
    const files = this.newPhotos().map((preview) => preview.file);
    const id = this.eventId();

    const request$ = id
      ? this.eventService.update(id, payload, files)
      : this.eventService.create(payload, files);

    request$.subscribe({
      next: () => {
        this.saving.set(false);
        this.router.navigateByUrl('/admin/eventos');
      },
      error: () => {
        this.saving.set(false);
        this.errorMessage.set('Não foi possível salvar o evento. Verifique os dados e tente novamente.');
      }
    });
  }
}
