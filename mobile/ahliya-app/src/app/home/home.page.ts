import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, MenuItem } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  name = '';
  role = '';
  menus: MenuItem[] = [];

  constructor(private auth: AuthService, private router: Router) {}

  async ionViewWillEnter() {
    this.name = await this.auth.getName();
    this.role = await this.auth.getRole();
    this.menus = await this.auth.getMenus();
    if (this.menus.length === 0) {
      const fresh = await this.auth.myMenu().catch(() => null);
      if (fresh) this.menus = fresh;
    }
  }

  open(route: string) {
    this.router.navigateByUrl(route);
  }

  async logout() {
    await this.auth.logout();
    window.dispatchEvent(new Event('ahliya-menu'));
    this.router.navigateByUrl('/login');
  }
}
