import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  get username(): string {
    return this.authService.currentUser()?.name ?? 'Fotógrafa';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}
