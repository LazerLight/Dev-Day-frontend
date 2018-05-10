import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import "rxjs/operator/toPromise";

@Injectable()
export class UserService {

  currentUser: User;
  
  constructor(
    private ajaxInstance: HttpClient
  ) {}

  check() {
    return this.ajaxInstance // 'withCredentials: true' means send the cookies
      .get("http://localhost:3000/api/checklogin", { withCredentials: true })
      .toPromise()
      .then((apiResponse: any) => {
        // set our logged in user state
        this.currentUser = apiResponse.userInfo;
        return apiResponse;
      });
  }
  postSignup( creds: SignupCredentials ) {
    return (
      this.ajaxInstance
        .post(
          "http://localhost:3000/api/signup",
          creds,
          { withCredentials: true })
        .toPromise()
        // delete the bottom part if you dont want the user to be automatically logged in after sign up
        .then(( apiResponse: any ) => {
          this.currentUser = apiResponse.userInfo;
          return apiResponse;
        })
    );
  }
  postLogin(creds: LoginCredentials) {
    return this.ajaxInstance
      .post("http://localhost:3000/api/login", creds, { withCredentials: true })
      .toPromise()
      .then((apiResponse: any) => {
        this.currentUser = apiResponse.userInfo;
        return apiResponse;
      });
  }

  logout() {
    return this.ajaxInstance
      .get("http://localhost:3000/api/logout", { withCredentials: true })
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
