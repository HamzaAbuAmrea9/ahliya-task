import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule) },
  { path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomePageModule), canActivate: [authGuard] },
  { path: 'change-password', loadChildren: () => import('./change-password/change-password.module').then(m => m.ChangePasswordPageModule), canActivate: [authGuard] },
  { path: 'qr-scanner', loadChildren: () => import('./qr-scanner/qr-scanner.module').then(m => m.QrScannerPageModule), canActivate: [authGuard] },
  { path: 'settings', loadChildren: () => import('./settings/settings.module').then(m => m.SettingsPageModule), canActivate: [authGuard] },
  { path: 'users', loadChildren: () => import('./users/users.module').then(m => m.UsersPageModule), canActivate: [authGuard] },
  { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardPageModule), canActivate: [authGuard] },
  { path: 'reports', loadChildren: () => import('./reports/reports.module').then(m => m.ReportsPageModule), canActivate: [authGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
