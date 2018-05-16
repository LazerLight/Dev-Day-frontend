import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import "rxjs/operator/toPromise";
import { environment } from "../../environments/environment";

@Injectable()
export class UserService {
  currentUser: User;

  constructor(private ajaxInstance: HttpClient) {}

  check() {
    return this.ajaxInstance // 'withCredentials: true' means send the cookies
      .get(`${environment.backUrl}/api/checklogin`, { withCredentials: true })
      .toPromise()
      .then((apiResponse: any) => {
        // set our logged in user state
        this.currentUser = apiResponse.userInfo;
        return apiResponse;
      });
  }
  postSignup(creds: SignupCredentials) {
    return (
      this.ajaxInstance
        .post(`${environment.backUrl}/api/signup`, creds, {
          withCredentials: true
        })
        .toPromise()
        // delete the bottom part if you dont want the user to be automatically logged in after sign up
        .then((apiResponse: any) => {
          this.currentUser = apiResponse.userInfo;
          return apiResponse;
        })
    );
  }
  postLogin(creds: LoginCredentials) {
    return this.ajaxInstance
      .post(`${environment.backUrl}/api/login`, creds, {
        withCredentials: true
      })
      .toPromise()
      .then((apiResponse: any) => {
        this.currentUser = apiResponse.userInfo;
        return apiResponse;
      });
  }

  logout() {
    return this.ajaxInstance
      .get(`${environment.backUrl}/api/logout`, { withCredentials: true })
      .toPromise()
      .then((apiResponse: any) => {
        this.currentUser = apiResponse.userInfo;
        return apiResponse;
      });
  }
}

export class User {
  _id: string;
  username: string;
  githubAvatar_url: string;
  updated_at: Date;
  created_at: Date;
}

export class LoginCredentials {
  username: string;
  password: string;
}

export class SignupCredentials {
  username: string;
  password: string;
}
