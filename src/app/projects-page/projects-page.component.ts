import { Component, OnInit } from '@angular/core';
import { Project, ProjectService, newProjectInfo } from "../api/project.service";
import { Router } from '@angular/router';
import { UserService, User } from '../api/user.service';
import { TrelloService } from '../api/trello.service';


@Component({
  selector: "app-projects-page",
  templateUrl: "./projects-page.component.html",
  styleUrls: ["./projects-page.component.css"]
})
export class ProjectsPageComponent implements OnInit {

  myUser;
  boards: any = [];
  newProjectInfo: newProjectInfo = new newProjectInfo();
  currentUserId: string;
  autocomplete: { data: { [key: string]: string } };

  constructor(
    private userThing: UserService,
    private apiThing: ProjectService,
    private resThing: Router,
    private trelloService: TrelloService
  ) { }

  ngOnInit() {
    this.fetchUserData();
    this.authUser();
  }


  authUser() {
    this.trelloService.authUser()
      .then(() => {
        console.log( "authUser SUCCESS" );
        return this.trelloService.getBoards();
      })
      .then(( boards ) => {
        this.boards = boards;
        this.setAutocomplete(this.boards);
        return this.trelloService.getMyUser();
      })
      .then(( myUser ) => {
        this.myUser = myUser;
      })
      .catch(( error ) => {
        console.log( "TRELLO ERROR" );
        console.log( error );
      })
  }

  
  fetchUserData() {
    // Get the info of the connected user
    return this.userThing.check().then(result => {
      this.currentUserId = result.userInfo._id;
    });
  }

  createProject() {
    this.newProjectInfo.owner = this.currentUserId;
    this.newProjectInfo.contributors.push(this.currentUserId);

    this.apiThing
      .postProject(this.newProjectInfo)
      .then(() => {
        // console.log(this.newProjectInfo);
        this.resThing.navigateByUrl("/projects");
      })
      // })
      .catch(err => {
        console.log("createProject ERROR");
        console.log(err);
      });
  }

  goToBoard( boardId ) {
    this.trelloService.getBoard( boardId )
      .then(( success ) => {
        // console.log( "getBoard SUCCESS" );
        // console.log( success );
        this.resThing.navigateByUrl( `/board/${ boardId }` );
      })
      .catch(( error ) => {
        console.log( "getBoard ERROR" );
        console.log( error );
      })
  }

  goToProject(projectId) {
    this.apiThing.getProject(projectId)
      .then((project: Project) => {
        this.resThing.navigateByUrl(`/project/${project._id}`);
      })
      .catch(err => {
        console.log("goToProject ERROR");
        console.log(err);
      });
  }

  setAutocomplete(projectList) {
    const autoCompleteData = {};
    projectList.forEach(elem => {
      autoCompleteData[elem.name] = null;
    });

    this.autocomplete = {
      data: autoCompleteData
    };
  }
}
