import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  public token: any = localStorage.getItem('token');

  constructor(private routes: Router) { }

  // ngOnInit() {
  //   this.token = ;
  // }

  signOut() {
    localStorage.removeItem('token');
    window.location.reload();
    this.routes.navigate(['/login']);
  }
}
