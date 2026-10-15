import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: false,
})
export class DashboardPage {
  cards = [
    { title: 'Total Users', value: '3', icon: 'people' },
    { title: 'Active', value: '3', icon: 'checkmark-circle' },
    { title: 'Reports', value: '12', icon: 'document-text' },
  ];
}
