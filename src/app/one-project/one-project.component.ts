//Don't use

//Don't use

//Don't use

//Don't use

//Don't use

//Don't use

//Don't use


import { Component, OnInit } from "@angular/core";
import { Project, ProjectService } from "../api/project.service";
import { ActivatedRoute, Router } from "@angular/router";
import { User, UserService } from "../api/user.service";
import { TrelloService } from "../api/trello.service";

@Component({
  selector: "app-one-project",
  templateUrl: "./one-project.component.html",
  styleUrls: ["./one-project.component.css"]
})
export class OneProjectComponent implements OnInit {
  currentUserId: string;
  isOwner: boolean;
  
  projectId: string;
  project: Project;
  
  
  username: string;
  foundUser: User;
  // addUserInfo: addUserInfo = new addUserInfo();
  
  autocomplete: { data: { [key: string]: string } };
  users: User[] = [];
  
  
  
  constructor(
    private reqThing: ActivatedRoute,
    private apiThing: ProjectService,
    private resThing: Router,
    private userThing: UserService,
    private trelloThing: TrelloService
  ) {}
  
  ngOnInit() {
    // Get the URL parameters for this route
    this.reqThing.paramMap.subscribe(myParams => {
      this.projectId = myParams.get( "projectId" );
      // this.fetchProjectData();
      // this.fetchUserData();
    });
      }
  
  // fetchProjectData() {
  //   this.apiThing.getProject( this.projectId )
  //   .then((result: Project) => {
  //     this.project = result;
  //   })
  //   .catch(( err ) => {
  //     console.log( "fetchProjectData ERROR" );
  //     console.log( err );
  //   })
    
  //   this.apiThing.getUsers()
  //   .then((usersList: User[]) =>{
  //     this.users = usersList
  //   })
  //   .then(()=>{
  //     this.setAutocomplete(this.users)
  //   })
  //   .catch(( err ) => {
  //     console.log( "getProjects ERROR" );
  //     console.log( err );
  //   })
  // }
    
  
  fetchUserData() {
    // Get the info of the connected user
    this.userThing.check().then(result => {
      this.currentUserId = result.userInfo._id;
      
      // Commented because we do not have a project ID anymore
      // this.isOwner = this.currentUserId === this.project.owner;
    });
  }
  
  // searchUser() {
  //   this.apiThing
  //   .getUser(this.username)
  //   .then((result: User) => {
  //     this.foundUser = result;
  //   })
  //   .catch(err => {
  //     console.log("searchUser ERROR");
  //     console.log(err);
  //   });
  // }
  
  
  setAutocomplete(userList) {
    this.autocomplete = {
      data: userList
    };
  }
  
  goToBot(projectId) {
    this.apiThing.getProject(projectId)
    .then((project: Project) => {
      this.resThing.navigateByUrl(`/project/${project._id}/bot`);
    })
    .catch(err => {
      console.log("goToProject ERROR");
      console.log(err);
    });
  }


  // addUser() {
  //   console.log(
  //     `Trying to add ${this.foundUser.username} to ${this.project.name}!`
  //   );
  
  //   this.addUserInfo.projectId = this.projectId;
  //   this.addUserInfo.userId = this.foundUser._id;
  
  //   this.apiThing
  //     .postUser(this.addUserInfo)
  //     .then(() => {
  //       this.resThing.navigateByUrl(`/project/${this.projectId}`);
  //     })
  //     .catch(err => {
  //       console.log("addUser ERROR");
  //       console.log(err);
  //     });
  // }
}
