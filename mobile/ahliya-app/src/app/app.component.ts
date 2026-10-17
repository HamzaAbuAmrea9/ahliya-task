import { Component, NgZone, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, MenuItem } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  menus = signal<MenuItem[]>([]);
  userName = signal('');
  role = signal('');

  constructor(private auth: AuthService, private router: Router, private zone: NgZone) {
    window.addEventListener('ahliya-menu', () => this.zone.run(() => this.load()));
    this.load();
  }

  async load() {
    if (await this.auth.isLoggedIn()) {
      this.menus.set(await this.auth.getMenus());
      this.userName.set(await this.auth.getName());
      this.role.set(await this.auth.getRole());
    } else {
      this.menus.set([]);
      this.userName.set('');
      this.role.set('');
    }
  }

  go(route: string) {
    this.router.navigateByUrl(route);
  }

  async logout() {
    await this.auth.logout();
    this.menus.set([]);
    window.dispatchEvent(new Event('ahliya-menu'));
    this.router.navigateByUrl('/login');
  }
}