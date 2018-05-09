import { Component, OnInit } from "@angular/core";
import { LoginCredentials, UserService } from "../api/user.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  formCreds: LoginCredentials = new LoginCredentials();
  constructor(public userInstance: UserService, private resInstance: Router) {}

  ngOnInit() {}

  loginSubmit() {
    this.userInstance
      .postLogin(this.formCreds)
      .then(result => {
        this.resInstance.navigateByUrl("/");
      })
      .catch(err => {
        console.log("login error");
        console.log(err);
      });
  }
}
