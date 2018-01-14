import { Injectable, Inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable()
export class NavGuardService implements CanActivate {
  constructor(@Inject('auth0') private auth, private router: Router) { }

  canActivate(): boolean {
    if ( this.auth.isAuthenticated() ) {
      return true;
    } else {
      // if cannat access, then redirect to home page
      this.router.navigate(['/']);
      return false;
    }
  }

  isAdmin(): boolean {
    if ( !this.auth.isAuthenticated() ) {
      return false;
    }
    // check user profile
    const profile = this.auth.getUserProfile();
    return (profile && profile.name === 'admin@sharecode.com');
  }
}
