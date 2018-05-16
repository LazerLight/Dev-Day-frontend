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

  getMyUser() {
    return new Promise(( success, error ) => {
      Trello.get( "/members/me", success, error );
    });
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

  getLists( boardId: string ) {
    return new Promise(( success, error ) => {
      Trello.get( `boards/${ boardId }/lists`, success, error );
    });
  }

  getCards( listId: string ) {
    return new Promise(( success, error ) => {
      Trello.get( `lists/${ listId }/cards`, success, error );
    })
  }

  moveToDoing( cardId: string, doingListId: string, currentUserId: string ) {
    return new Promise(( success, error ) => {
      Trello.put( `cards/${ cardId }?idMembers=${ currentUserId }&idList=${ doingListId }`, success, error );
    })
  }

  moveToDone( cardId: string, doneListId: string ) {
    return new Promise(( success, error ) => {
      Trello.put( `cards/${ cardId }?idList=${ doneListId }`, success, error );
    })
  }
}
