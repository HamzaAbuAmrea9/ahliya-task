import { Component, signal } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
  standalone: false,
})
export class UsersPage {
  users = signal<any[]>([]);
  loading = signal(true);

  constructor(private auth: AuthService) {}

  async ionViewWillEnter() {
    this.loading.set(true);
    try {
      this.users.set((await this.auth.getUsers()) || []);
    } catch {
      this.users.set([]);
    }
    this.loading.set(false);
  }
}