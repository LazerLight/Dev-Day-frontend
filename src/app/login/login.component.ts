import { Component, OnInit } from "@angular/core";
import { LoginCredentials, UserService } from "../api/user.service";
import { Router } from "@angular/router";
import { environment } from "../../environments/environment.prod";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  formCreds: LoginCredentials = new LoginCredentials();
  logo: string;
  environment = environment



  constructor(public userInstance: UserService, private resInstance: Router) {
    this.logo = 'assets/images/verticalLogoLight.png' 
  }
  
  ngOnInit() {}

  loginSubmit() {
    this.userInstance
      .postLogin(this.formCreds)
      .then(result => {
        this.resInstance.navigateByUrl("/projects");
      })
      .catch(err => {
        console.log("login error");
        console.log(err);
      });
  }
}
