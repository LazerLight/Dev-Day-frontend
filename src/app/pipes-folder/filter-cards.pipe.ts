import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterCards'
})
export class FilterCardsPipe implements PipeTransform {

  transform( value: any[], currentUserId: string ): any[] {
    if( !value ) {
      return [];
    }

    const filteredCards: any[] = [];

    value.forEach(( oneCard ) => {
      console.log(oneCard.idMembers, currentUserId)
      if( oneCard.idMembers.includes( currentUserId )) {
        filteredCards.push( oneCard );
      }
    });

    // PRO WAY
    // return value.filter( oneCard => {
    // oneCard.idMembers.includes( currentUserId )
    // })
    // DIDN'T ACTUALLY TEST IT

    return filteredCards;
  }

}
