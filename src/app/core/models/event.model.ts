export interface EventPhoto {
  id: string;
  url: string;
  originalName?: string;
}

export interface PortfolioEvent {
  id: string;
  title: string;
  location: string;
  date: string;
  description?: string;
  photos: EventPhoto[];
  createdAt: string;
  updatedAt?: string;
}

export interface CreateEventPayload {
  title: string;
  location: string;
  date: string;
  description?: string;
}
