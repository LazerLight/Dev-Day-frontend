import { Pipe, PipeTransform } from '@angular/core';
import { Project } from '../api/project.service';

@Pipe({
  name: 'isContributor'
})
export class IsContributorPipe implements PipeTransform {

  transform(value: Project[], currentUserId: string): Project[] {
    if( !value ) {
      return [];
    }

    const filteredProjects: Project[] = [];

    value.forEach(( oneProject) => {
      if( oneProject.contributors.includes( currentUserId )) {
        filteredProjects.push( oneProject );
      }
    });

    // PRO WAY
    // return value.filter( oneProject => {
    //  oneProject.contributors.includes( currentUserId )
    // })

    return filteredProjects;
  }

}
