import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Profile } from '../interfaces/profile.interface';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  http = inject(HttpClient);
  baseApiURL = 'https://icherniakov.ru/yt-course/';
  constructor() {}

  getTestAccounts(): Observable<any> {
    return this.http.get<Profile[]>(`${this.baseApiURL}account/test_accounts`);
  }

  getMe() {
    return this.http.get<Profile>(`${this.baseApiURL}account/me`);
  }
}
