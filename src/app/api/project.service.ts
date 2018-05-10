import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import "rxjs/operator/toPromise";

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
  // Pas encore fait, check autres exemples ? Car dans "phone" on ne l'a pas fait je crois

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
  gitHubUrl: string;
  trelloBoardId: string;
  slackId: string;
  slackUserId: string;
  usersArray: User[];
  activityFeed: Object[];
  createdAt?: Date;
  updatedAt?: Date;
}