import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

   // For redirecting to url check: auth.service, auth-guard.service and app.component.ts
  // For redirecting user to the route he/she tried to access:
  constructor(private userService: UserService, private auth: AuthService, private router: Router){
    auth.user$.subscribe(user => {
      if (!user) return;
        // Storing users in database:
      userService.save(user);

      const returnUrl = localStorage.getItem('returnUrl');
      if (!returnUrl) return;

      localStorage.removeItem('returnUrl');
      router.navigateByUrl(returnUrl);
    });
  }

}
