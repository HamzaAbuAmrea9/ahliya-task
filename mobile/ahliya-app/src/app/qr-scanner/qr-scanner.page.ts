import { Component, signal } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';

@Component({
  selector: 'app-qr-scanner',
  templateUrl: './qr-scanner.page.html',
  styleUrls: ['./qr-scanner.page.scss'],
  standalone: false,
})
export class QrScannerPage {
  result = signal('');
  history = signal<string[]>([]);

  constructor(private toast: ToastController) {}

  async scan() {
    try {
      const perm = await BarcodeScanner.checkPermissions();
      if (perm.camera !== 'granted') {
        await BarcodeScanner.requestPermissions();
      }
      const res = await BarcodeScanner.scan();
      if (res.barcodes.length > 0) {
        this.result.set(res.barcodes[0].displayValue || '');
        this.history.update(h => [this.result(), ...h]);
      } else {
        this.msg('Nothing found');
      }
    } catch {
      this.msg('Scan failed');
    }
  }

  async copy(text: string) {
    await navigator.clipboard.writeText(text).catch(() => {});
    this.msg('Copied');
  }

  clear() {
    this.result.set('');
    this.history.set([]);
  }

  async msg(t: string) {
    (await this.toast.create({ message: t, duration: 1500 })).present();
  }
}