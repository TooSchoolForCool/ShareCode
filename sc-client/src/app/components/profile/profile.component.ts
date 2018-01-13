import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  public email = '';
  public username = '';
  public user_id = '';

  constructor(@Inject('auth0') private auth) { }

  ngOnInit() {
    this.auth.getUserProfile()
      .then(profile => {
        this.email = profile.name;
        this.username = profile.nickname;
        this.user_id = profile.sub;
      })
      .catch(err => console.log(err));
  }

  public resetPassword(): void {
    this.auth.resetPassword(this.email);
  }
}
