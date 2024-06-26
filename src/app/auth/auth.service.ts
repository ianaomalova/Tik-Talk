import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError, tap, throwError} from "rxjs";
import {TokenResponse} from "./auth.interface";
import {CookieService} from "ngx-cookie-service";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  http = inject(HttpClient);
  router: Router = inject(Router);
  cookieService = inject(CookieService);
  token: string | null = null;
  refreshToken: string | null = null;
  baseApiURL = 'https://icherniakov.ru/yt-course/auth/';
  constructor() { }

  get isAuth() {
    if(!this.token) {
      this.token = this.cookieService.get('token');
      this.refreshToken = this.cookieService.get('refresh_token');
    }
    return !!this.token;
  }

  login(payload: {username: string, password: string}) {
    const fd = new FormData();
    fd.append('username', payload.username);
    fd.append('password', payload.password);
    return this.http.post<TokenResponse>(`${this.baseApiURL}token`, fd)
      .pipe(
        tap(value => {
          this.saveTokens(value);
        })
      );
  }

  refreshAuthToken() {
    return this.http.post<TokenResponse>(`${this.baseApiURL}refresh`, {
      refresh_token: this.refreshToken
    }).pipe(
      tap(res => {
        this.saveTokens(res);
      }),
      catchError(err => {
        return throwError(err)
      })
    )
  }

  saveTokens(response: TokenResponse) {
    this.token = response.access_token;
    this.refreshToken = response.refresh_token;

    this.cookieService.set('token', this.token);
    this.cookieService.set('refreshToken', this.refreshToken);
  }

  logout() {
    this.cookieService.deleteAll();
    this.token = null;
    this.refreshToken = null;
    this.router.navigate(['/login'])
  }
}

