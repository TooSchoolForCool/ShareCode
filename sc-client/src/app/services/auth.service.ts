import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import 'rxjs/add/operator/filter';
import * as auth0 from 'auth0-js';
import {current} from 'codelyzer/util/syntaxKind';

@Injectable()
export class AuthService {
  auth0 = new auth0.WebAuth({
    clientID: 'ffo29j7yKM850v1LcXyz9EoF61ozrkFE',
    domain: 'sharecode.auth0.com',
    responseType: 'token id_token',
    audience: 'https://sharecode.auth0.com/userinfo',
    redirectUri: 'http://localhost:3000/',
    scope: 'openid'
  });

  constructor(public router: Router) {}

  public login(): void {
    // store current url to localStorage for redirection after login
    localStorage.setItem('login_url', this.router.url);
    this.auth0.authorize();
  }

  public handleAuthentication(): void {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        window.location.hash = '';
        this.setSession(authResult);
        // read the login url, and jump back to the same page after login
        this.router.navigate([localStorage.getItem('login_url')]);
      } else if (err) {
        this.router.navigate(['/problems']);
        console.log(err);
      }
    });
  }

  private setSession(authResult): void {
    // Set the time that the access token will expire at
    const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
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

}
