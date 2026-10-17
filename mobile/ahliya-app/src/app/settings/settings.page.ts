import { Component, signal } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';
import { NativeBiometric } from '@capgo/capacitor-native-biometric';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: false,
})
export class SettingsPage {
  enabled = signal(false);
  email = '';
  password = '';

  constructor(private auth: AuthService, private toast: ToastController) {}

  async ionViewWillEnter() {
    this.enabled.set(!!(await Preferences.get({ key: 'biometric_email' })).value);
  }

  async toggle() {
    if (!this.enabled()) {
      await Preferences.remove({ key: 'biometric_email' });
      await Preferences.remove({ key: 'biometric_pass' });
      this.msg('Face login disabled');
      return;
    }
    if (!this.email || !this.password) {
      this.msg('Enter email and password to enable');
      this.enabled.set(false);
      return;
    }
    try {
      const avail = await NativeBiometric.isAvailable();
      if (!avail.isAvailable) {
        this.msg('Biometric not available');
        this.enabled.set(false);
        return;
      }
      await NativeBiometric.verifyIdentity({ reason: 'Enable face login' });
      await Preferences.set({ key: 'biometric_email', value: this.email });
      await Preferences.set({ key: 'biometric_pass', value: this.password });
      await this.auth.enableBiometric('mobile-device').catch(() => {});
      this.msg('Face login enabled');
    } catch {
      this.enabled.set(false);
      this.msg('Failed to enable');
    }
  }

  async msg(t: string) {
    (await this.toast.create({ message: t, duration: 2000 })).present();
  }
}
