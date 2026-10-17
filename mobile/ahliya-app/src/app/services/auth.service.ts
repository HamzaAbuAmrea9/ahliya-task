import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Preferences } from '@capacitor/preferences';
import { environment } from '../../environments/environment';

export interface MenuItem {
  id: number;
  title: string;
  icon: string;
  route: string;
}

export interface LoginResult {
  accessToken: string;
  refreshToken: string;
  fullName: string;
  email: string;
  role: string;
  menus: MenuItem[];
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private base = environment.apiUrl;

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return this.http.post<LoginResult>(`${this.base}/auth/login`, { email, password });
  }

  async saveSession(data: LoginResult) {
    await Preferences.set({ key: 'access', value: data.accessToken });
    await Preferences.set({ key: 'refresh', value: data.refreshToken });
    await Preferences.set({ key: 'name', value: data.fullName });
    await Preferences.set({ key: 'email', value: data.email });
    await Preferences.set({ key: 'role', value: data.role });
    await Preferences.set({ key: 'menus', value: JSON.stringify(data.menus) });
  }

  async getAccess() {
    return (await Preferences.get({ key: 'access' })).value;
  }

  async getMenus(): Promise<MenuItem[]> {
    const v = (await Preferences.get({ key: 'menus' })).value;
    return v ? JSON.parse(v) : [];
  }

  async getName() {
    return (await Preferences.get({ key: 'name' })).value || '';
  }

  async getRole() {
    return (await Preferences.get({ key: 'role' })).value || '';
  }

  async isLoggedIn() {
    return !!(await this.getAccess());
  }

  private async headers() {
    const t = await this.getAccess();
    return new HttpHeaders({ Authorization: `Bearer ${t}` });
  }

  async myMenu(): Promise<MenuItem[]> {
    const h = await this.headers();
    return firstValueFrom(this.http.get<MenuItem[]>(`${this.base}/menu/my-menu`, { headers: h }));
  }

  async changePassword(oldPassword: string, newPassword: string) {
    const h = await this.headers();
    return firstValueFrom(this.http.post(`${this.base}/auth/change-password`, { oldPassword, newPassword }, { headers: h }));
  }

  async getUsers(): Promise<any[]> {
    const h = await this.headers();
    return firstValueFrom(this.http.get<any[]>(`${this.base}/users`, { headers: h }));
  }

  async enableBiometric(deviceId: string) {
    const h = await this.headers();
    return firstValueFrom(this.http.post(`${this.base}/auth/enable-biometric`, { deviceId }, { headers: h }));
  }

  async logout() {
    const refresh = (await Preferences.get({ key: 'refresh' })).value || '';
    const bioEmail = (await Preferences.get({ key: 'biometric_email' })).value;
    const bioPass = (await Preferences.get({ key: 'biometric_pass' })).value;
    const h = await this.headers();
    try {
      await firstValueFrom(this.http.post(`${this.base}/auth/logout`, { refreshToken: refresh }, { headers: h }));
    } catch {}
    await Preferences.clear();
    if (bioEmail) await Preferences.set({ key: 'biometric_email', value: bioEmail });
    if (bioPass) await Preferences.set({ key: 'biometric_pass', value: bioPass });
  }
}
