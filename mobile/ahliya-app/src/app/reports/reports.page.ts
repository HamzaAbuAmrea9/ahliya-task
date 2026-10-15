import { Component } from '@angular/core';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss'],
  standalone: false,
})
export class ReportsPage {
  rows = [
    { name: 'Daily logins', count: 24 },
    { name: 'Password changes', count: 3 },
    { name: 'QR scans', count: 11 },
  ];
}
