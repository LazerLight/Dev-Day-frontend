import { Component, OnInit } from '@angular/core';
import { Project, ProjectService, addUserInfo } from '../api/project.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../api/user.service';

@Component({
  selector: 'app-one-project',
  templateUrl: './one-project.component.html',
  styleUrls: ['./one-project.component.css']
})
export class OneProjectComponent implements OnInit {

  projectId: string;
  project: Project;
  username: string;
  foundUser: User;
  addUserInfo: addUserInfo = new addUserInfo();

  constructor(
    private reqThing: ActivatedRoute,
    private apiThing: ProjectService,
    private resThing: Router
  ) { }

  ngOnInit() {
    // Get the URL parameters for this route
    this.reqThing.paramMap
      .subscribe(( myParams ) => {
        this.projectId = myParams.get( "projectId" )
        this.fetchProjectData();
      })
  }

  fetchProjectData() {
    this.apiThing.getProject( this.projectId )
      .then(( result: Project ) => {
        this.project = result;
      })
      .catch(( err ) => {
        console.log( "fetProjectData ERROR" );
        console.log( err );
      })
  }

  searchUser() {
    this.apiThing.getUser( this.username )
      .then(( result: User ) => {
        this.foundUser = result;
      })
      .catch(( err ) => {
        console.log( "searchUser ERROR" );
        console.log( err );
      })
  }

  addUser() {
    console.log( `Trying to add ${ this.foundUser.username } to ${ this.project.name }!` );
    
    this.addUserInfo.projectId = this.projectId;
    this.addUserInfo.userId = this.foundUser._id;

    this.apiThing.postUser( this.addUserInfo )
      .then(() => {
        this.resThing.navigateByUrl( `/project/${ this.projectId }`)
      })
      .catch(( err ) => {
        console.log( "addUser ERROR" );
        console.log( err );
      })
  }

}
