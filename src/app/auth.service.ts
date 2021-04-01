import { UserService } from './user.service';
import { switchMap } from 'rxjs/operators';
import { AppUser } from './models/app-user';
import { Injectable } from '@angular/core';

// Google auth: import:
import * as firebase from 'firebase';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable, of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<firebase.User>;

  constructor(
    private afAuth: AngularFireAuth,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private route: Router) {
    this.user$ = afAuth.authState;
  }

  login(){
    // For redirecting to url check: auth.service, auth-guard.service and app.component.ts
    // For redirecting user to the route he/she tried to access: 
    let returnUrl = this.activatedRoute.snapshot.queryParamMap.get('returnUrl') || '/';
    localStorage.setItem('returnUrl', returnUrl);

    this.afAuth.auth.signInWithRedirect(new firebase.auth.GoogleAuthProvider());
  }

  logout(){
    this.afAuth.auth.signOut();
    this.route.navigateByUrl('/');
  }

  // Showing or hiding admin links.
  // Since isAdmin property is needed to determine if user is admin or not
  // we need a database user instead of firebase user in html template.
  // to get it:
  get appUser$(): Observable<AppUser>{
    return this.user$.pipe(
      switchMap(user => user
      ? this.userService.get(user.uid).valueChanges()
      : of(null)
    ));
      // this is an object of a user that is represented by firebase authentication
      // and not a user object we store in database.
      // so first we need to go to user.service.ts and define a method
      // for reading user objects from database
      // this.userService.get(user.uid).valueChanges()
  }

      /*
       when using switchMap operator, to map one observable
       to another, and then use this with an async pipe in
       template, the mapped observable is emitting new value each time.

       (on former line in template: *ngIf="auth.appUser$ | async as user; else anonymousUser",
       now its *ngIf="appUser.name; else anonymousUser")

       This causes angular to run change detection in html template,
       which creates an infinite loop.
       Thats why we need to change implementation on template, and
       instead of using async pipe, we need to subscribe to auth.appUser$ once
       in our bs-navbar.component and pass that as an object to the template.

       Async pipe marks template for change detection every time there is 
       a new value in the observable.
      */
}
