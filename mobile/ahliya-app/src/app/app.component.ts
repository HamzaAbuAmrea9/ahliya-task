import { Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, MenuItem } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  menus: MenuItem[] = [];
  userName = '';
  role = '';

  constructor(private auth: AuthService, private router: Router, private zone: NgZone) {
    window.addEventListener('ahliya-menu', () => this.zone.run(() => this.load()));
    this.load();
  }

  async load() {
    if (await this.auth.isLoggedIn()) {
      this.menus = await this.auth.getMenus();
      this.userName = await this.auth.getName();
      this.role = await this.auth.getRole();
    } else {
      this.menus = [];
      this.userName = '';
      this.role = '';
    }
  }

  go(route: string) {
    this.router.navigateByUrl(route);
  }

  async logout() {
    await this.auth.logout();
    this.menus = [];
    this.router.navigateByUrl('/login');
  }
}
