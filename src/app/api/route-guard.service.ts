import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from "@angular/router";
import { UserService } from "./user.service";

@Injectable()
export class RouteGuardService implements CanActivate {
  constructor(private userThing: UserService, private resThing: Router) {}

  canActivate() {
    if (this.userThing.currentUser) {
      return true;
    }

    return this.userThing
      .check()
      .then(result => {
        const isGood = Boolean(result.userInfo);
        if (!isGood) {
          this.redirect();
        }
        return isGood;
      })
      .catch(err => {
        console.log("canActivate ERROR");
        console.log(err);
        this.redirect();
        return false;
      });
  }

  redirect() {
    this.resThing.navigateByUrl("/");
  }
}
