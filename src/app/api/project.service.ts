import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import "rxjs/operator/toPromise";
import { User } from './user.service';

@Injectable()
export class ProjectService {

  constructor(
    // ajaxTruc is what has acces to the http requests, the get, post, etc.
    private ajaxThing: HttpClient
  ) { }

  // GET /api/projects
  getProjects() {
    return this.ajaxThing
      .get( "http://localhost:3000/api/projects" )
      .toPromise();
  }

  // POST /api/projects
  postProject( info: newProjectInfo ) {
    return this.ajaxThing
      .post(
        "http://localhost:3000/api/projects",
        info
      )
      .toPromise();
  }

  // GET /api/project/:projectId
  getProject( projectId ) {
    return this.ajaxThing
      .get( `http://localhost:3000/api/project/${ projectId }` )
      .toPromise();
  }


}

export class Project {
  _id: string;
  ownerId: string;
  name: string;
  imageUrl: string;
  gitHubUrl: string;
  trelloBoardId: string;
  slackId: string;
  slackUserId: string;
  usersArray: User[];
  activityFeed: Object[];
  createdAt?: Date;
  updatedAt?: Date;
}

export class newProjectInfo {
  ownerId: string; // Specify that the creating user becomes the owner
  name: string;
  imageUrl: string;
  gitHubUrl: string;
  trelloBoardId: string;
  slackId: string;
  usersArray: User[]; // Specify that the creating user becomes the first member
}