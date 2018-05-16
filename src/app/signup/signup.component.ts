import { Component, OnInit } from "@angular/core";
import { SignupCredentials, UserService } from "../api/user.service";
import { Router } from "@angular/router";
import { environment } from "../../environments/environment";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"]
})
export class SignupComponent implements OnInit {
  githubUrl: string;

  formCreds: SignupCredentials = new SignupCredentials();
  environment = environment;
  constructor(public userInstance: UserService, private resInstance: Router) {
    this.githubUrl = `${environment.backUrl}/api/github/login`;
  }

  ngOnInit() {}
  signupSubmit() {
    this.userInstance
      .postSignup(this.formCreds)
      .then(result => {
        this.resInstance.navigateByUrl("/projects");
      })
      .catch(err => {
        console.log("signup error");
        console.log(err);
      });
  }
}
