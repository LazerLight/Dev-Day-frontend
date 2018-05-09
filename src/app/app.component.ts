import { Component } from "@angular/core";
import { UserService } from "./api/user.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  title = "app";

  constructor(public userInstance: UserService) {}

  ngOnInit() {
    this.userInstance.check().catch(err => {
      console.log("App login check error");
      console.log(err);
    });
  }

  logoutClick() {
    this.userInstance.logout().catch(err => {
      console.log("App logout error");
      console.log(err);
    });
  }
}
