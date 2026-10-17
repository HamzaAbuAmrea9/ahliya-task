import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';
import { NativeBiometric } from '@capgo/capacitor-native-biometric';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage {
  email = '';
  password = '';
  showPass = false;
  hasBiometric = signal(false);

  constructor(
    private auth: AuthService,
    private router: Router,
    private loading: LoadingController,
    private toast: ToastController
  ) {}

  async ionViewWillEnter() {
    const saved = (await Preferences.get({ key: 'biometric_email' })).value;
    this.hasBiometric.set(!!saved);
    if (await this.auth.isLoggedIn()) this.router.navigateByUrl('/home');
  }

  async doLogin() {
    if (!this.email || !this.password) {
      this.msg('Enter email and password');
      return;
    }
    const l = await this.loading.create({ message: 'Login...' });
    await l.present();
    try {
      const res = await firstValueFrom(this.auth.login(this.email, this.password));
      await this.auth.saveSession(res!);
      window.dispatchEvent(new Event('ahliya-menu'));
      l.dismiss();
      this.router.navigateByUrl('/home');
    } catch {
      l.dismiss();
      this.msg('Email or password is wrong');
    }
  }

  async faceLogin() {
    try {
      await NativeBiometric.verifyIdentity({ reason: 'Login with face' });
      const email = (await Preferences.get({ key: 'biometric_email' })).value;
      const pass = (await Preferences.get({ key: 'biometric_pass' })).value;
      if (!email || !pass) {
        this.msg('Please login with password first');
        return;
      }
      this.email = email;
      this.password = pass;
      this.doLogin();
    } catch {
      this.msg('Face login failed');
    }
  }

  async msg(t: string) {
    (await this.toast.create({ message: t, duration: 2000 })).present();
  }
}
