import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import "rxjs/operator/toPromise";
import { Project } from "./project.service";

@Injectable()
export class CardService {
  constructor(private ajaxThing: HttpClient) {}

  // GET list of Lists for one Project
  getLists(projectId: string) {
    return this.ajaxThing
      .get(`http://localhost:3000/api/project/${projectId}/lists`)
      .toPromise();
  }
  // GET Cards LIST for one List of one Project
  getCards(projectId: string, listId: string) {
    return this.ajaxThing
      .get(`http://localhost:3000/api/project/${projectId}/${listId}/cards`)
      .toPromise();
  }
}

export class List {
  _id: string;
  projectId: string[] = [];
  name: string;
  trelloBoardId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Card {
  _id: string;
  listId: string[] = [];
  name: string;
  description: string;
  dueDate: Date;
  trelloBoardId: string;
  labels: Object[]; // depends on trello format
  comments: Object[]; // depends on trello format
  contributors: string[] = [];
  taskDuration: number;
  createdAt?: Date;
  updatedAt?: Date;
}
