import { Component, OnInit } from '@angular/core';
import { Project, ProjectService } from '../api/project.service';
import { ActivatedRoute } from '@angular/router';
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
  foundUsers: User;

  constructor(
    private reqThing: ActivatedRoute,
    private apiThing: ProjectService
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
        this.foundUsers = result;
      })
      .catch(( err ) => {
        console.log( "searchUser ERROR" );
        console.log( err );
      })
  }

}
