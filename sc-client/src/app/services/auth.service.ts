import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import 'rxjs/add/operator/filter';
import * as auth0 from 'auth0-js';

@Injectable()
export class AuthService {
  auth0 = new auth0.WebAuth({
    clientID: 'ffo29j7yKM850v1LcXyz9EoF61ozrkFE',
    domain: 'sharecode.auth0.com',
    responseType: 'token id_token',
    audience: 'https://sharecode.auth0.com/userinfo',
    redirectUri: 'http://localhost:3000/',
    scope: 'openid profile'
  });

  constructor(public router: Router) {}

  public login(): void {
    // store current url to localStorage for redirection after login
    this.saveCurrentLoginUrl()
      .then(() => {
        this.auth0.authorize();
      });
  }

  public handleAuthentication(): void {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        window.location.hash = '';
        this.setSession(authResult);
        // read the login url, and jump back to the same page after login
        this.router.navigate([localStorage.getItem('login_url')]);
        // reload page to get username
        window.location.reload();
      } else if (err) {
        this.router.navigate(['/problems']);
        console.log(err);
      }
    });
  }

  public logout(): void {
    // Remove tokens and expiry time from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('profile');
    localStorage.removeItem('login_url');

    // Go back to the home route
    this.router.navigate(['/']);
  }

  public isAuthenticated(): boolean {
    // Check whether the current time is past the
    // access token's expiry time
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
  }

  public getUserProfile(callback): Promise<Object> {
    return new Promise((resolve, reject) => {
      const access_token = localStorage.getItem('access_token');
      // cannot file access_token
      if ( !access_token ) {
        reject('Access token must exist to fetch profile!');
      }

      // fetch user profile
      this.auth0.client.userInfo(access_token, (err, profile) => {
        if (profile) {
          resolve(profile);
        } else {
          reject(err);
        }
      });
    });
  }

  private setSession(authResult): void {
    // Set the time that the access token will expire at
    const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('profile', authResult.profile);
    localStorage.setItem('expires_at', expiresAt);
  }

  // store current url to localStorage for redirection after login
  private saveCurrentLoginUrl(): Promise<void> {
    return new Promise((resolve) => {
      localStorage.setItem('login_url', this.router.url);
      resolve();
    });
  }

}
