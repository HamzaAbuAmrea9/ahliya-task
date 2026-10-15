import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
  standalone: false,
})
export class ChangePasswordPage {
  oldPass = '';
  newPass = '';
  confirm = '';

  constructor(private auth: AuthService, private toast: ToastController) {}

  async save() {
    if (this.newPass !== this.confirm) {
      this.msg('Passwords do not match');
      return;
    }
    if (this.newPass.length < 6) {
      this.msg('Password must be 6+ characters');
      return;
    }
    try {
      await this.auth.changePassword(this.oldPass, this.newPass);
      this.msg('Password changed');
      this.oldPass = '';
      this.newPass = '';
      this.confirm = '';
    } catch (e: any) {
      this.msg(e.error?.message || 'Failed');
    }
  }

  async msg(t: string) {
    (await this.toast.create({ message: t, duration: 2000 })).present();
  }
}
