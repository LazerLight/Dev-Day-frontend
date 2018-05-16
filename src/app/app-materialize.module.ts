import { NgModule } from "@angular/core";
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MzButtonModule, MzNavbarModule, MzCollectionModule, MzCollapsibleModule, MzInputModule} from 'ng2-materialize'

const mat_modules = [
    MzNavbarModule,
    MzButtonModule,
    MzCollectionModule,
    MzCollapsibleModule,
    MzInputModule,
]
@NgModule({
    imports: [
        NoopAnimationsModule,
        mat_modules
    ],
    exports: mat_modules
})

export class MaterializeModule{}