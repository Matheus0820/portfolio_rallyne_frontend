import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreateEventPayload, PortfolioEvent } from '../models/event.model';

/**
 * Responsável somente pelo acesso aos dados de eventos do portfólio
 * (leitura pública + escrita administrativa). Nenhuma lógica de UI aqui.
 */
@Injectable({ providedIn: 'root' })
export class EventService {
  private readonly apiUrl = `${environment.apiUrl}/events`;

  constructor(private readonly http: HttpClient) {}

  list(): Observable<PortfolioEvent[]> {
    return this.http.get<PortfolioEvent[]>(this.apiUrl);
  }

  getById(id: string): Observable<PortfolioEvent> {
    return this.http.get<PortfolioEvent>(`${this.apiUrl}/${id}`);
  }

  create(payload: CreateEventPayload, photos: File[]): Observable<PortfolioEvent> {
    const formData = this.buildFormData(payload, photos);
    return this.http.post<PortfolioEvent>(this.apiUrl, formData);
  }

  update(id: string, payload: CreateEventPayload, photos: File[]): Observable<PortfolioEvent> {
    const formData = this.buildFormData(payload, photos);
    return this.http.put<PortfolioEvent>(`${this.apiUrl}/${id}`, formData);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  deletePhoto(eventId: string, photoId: string): Observable<PortfolioEvent> {
    return this.http.delete<PortfolioEvent>(`${this.apiUrl}/${eventId}/photos/${photoId}`);
  }

  /**
   * Os caminhos de foto retornados pela API são relativos (ex.: /uploads/arquivo.jpg),
   * pois o backend guarda apenas o caminho físico no servidor. Aqui montamos a URL
   * completa para exibição, usando a raiz do backend (apiUrl sem o sufixo /api).
   */
  resolvePhotoUrl(path: string): string {
    if (/^https?:\/\//i.test(path)) {
      return path;
    }
    const backendRoot = environment.apiUrl.replace(/\/api\/?$/, '');
    return `${backendRoot}${path}`;
  }

  private buildFormData(payload: CreateEventPayload, photos: File[]): FormData {
    const formData = new FormData();
    formData.append('title', payload.title);
    formData.append('location', payload.location);
    formData.append('date', payload.date);
    if (payload.description) {
      formData.append('description', payload.description);
    }
    photos.forEach((file) => formData.append('photos', file, file.name));
    return formData;
  }
}
