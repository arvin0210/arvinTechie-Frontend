import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, Observable, tap } from 'rxjs';
import { AuthenticateService } from './authenticate.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthenticateService, private router: Router) { }

  canActivate(): Observable<boolean> {
    return this.authService.isTokenValid().pipe(map(r => {
      if (!r) {
        this.router.navigate(["/login"]);
        return false;
      } else {
        return true;
      }
    }));

  }

}
