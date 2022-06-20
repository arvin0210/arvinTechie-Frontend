import { Component, Input } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { AuthenticateService } from 'src/app/services/auth/authenticate.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  @Input('sidenav') sidenav!: MatSidenav;
  title = 'Project Management';
  titleSmall = 'Project MGT';
  constructor(public authService: AuthenticateService, private router: Router,) { }

  get isAuth() {
    return this.authService.isAuthenticated();
  }

  get userAccount() {
    return this.authService.getUserAccount();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

}
