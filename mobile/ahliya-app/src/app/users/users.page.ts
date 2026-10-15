import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
  standalone: false,
})
export class UsersPage {
  users: any[] = [];
  loading = true;

  constructor(private auth: AuthService) {}

  async ionViewWillEnter() {
    this.loading = true;
    try {
      this.users = (await this.auth.getUsers()) || [];
    } catch {
      this.users = [];
    }
    this.loading = false;
  }
}
