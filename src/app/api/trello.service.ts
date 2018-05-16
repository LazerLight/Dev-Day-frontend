import { Injectable } from '@angular/core';

declare var Trello: any;

@Injectable()
export class TrelloService {
  
  constructor(

  ) { }

  authUser() {
    return new Promise(( success, error ) => {
      Trello.authorize({
        type: 'popup',
        name: 'Getting Started Application',
        scope: {
          read: 'true',
          write: 'true' },
          expiration: 'never',
          success,
          error
        });
    })
  }

  getBoards() {
    return new Promise(( success, error ) => {
      Trello.get( '/member/me/boards', success, error );
    });
  }

  getBoard( boardId: string ) {
    return new Promise(( success, error ) => {
      Trello.get( `/boards/${ boardId }`, success, error );
    });
  }

  getMembers( boardId: string ) {
    return new Promise(( success, error ) => {
      Trello.get( `/boards/${ boardId }/members`, success, error );
    });
  }

  getLists( boardShortLink: string ) {
    return new Promise(( success, error ) => {
      Trello.get( `boards/${ boardShortLink }/lists?cards=open&card_fields=name&filter=open&fields=name`, success, error );
    });
  }
}
