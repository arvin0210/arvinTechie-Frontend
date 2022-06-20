import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserAccount, UserAccountDto } from '../../model/user-account.model';

@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {


  constructor(private http: HttpClient,) { }

  get api(): string {
    return environment.apiUrl;
  }

  get isAdmin() {
    return this.getUserAccount().role.admin;
  }

  public logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('JWTtoken');
    localStorage.removeItem('currentUser');
  }

  public generateToken(request: any) {
    return this.http.post<string>(`${this.api}/user/authenticate`, request, { responseType: 'text' as 'json' });
  }

  login(userName: string, passWord: string) {  

    const headers = new HttpHeaders().set("Authorization", this.getToken());

    const params = new HttpParams()
      .append('userName', userName)
      .append('passWord', passWord);

    const body = "";

    return this.http
      .post<any>(`${this.api}/user/login_credentials`, body, { headers: headers, params: params })
      .pipe(map(user => {
        if (user) {
          localStorage.setItem('currentUser', JSON.stringify(user));
        }
        return user as UserAccountDto;
      }));

  }

  public isAuthenticated(): boolean {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser == null)
      return false;
    else
      return true;
  }

  public getUserAccount(): UserAccountDto {
    let currentUser = JSON.parse(localStorage.getItem('currentUser') || "null");
    let user: UserAccountDto = <UserAccountDto>currentUser;
    return user;
  }

  public getToken(): string {
    return localStorage.getItem('JWTtoken') as string;
  }

  public setToken(token: string) {
    localStorage.setItem('JWTtoken', "Bearer " + token);
  }

  public getHeaders() {
    return new HttpHeaders().set("Authorization", this.getToken());
  }

  public isTokenValid() {
    const params = new HttpParams()
      .append('token', this.getToken());
    return this.http.post<boolean>(`${this.api}/user/isTokenValid`, "", { params: params });
  }


}
