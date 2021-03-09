import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyDetailComponent } from './my-detail/my-detail.component';
import { Tab3Page } from './tab3.page';

const routes: Routes = [
    {
        path: '',
        component: Tab3Page,
    }, {
        path: 'my-detail',
        component: MyDetailComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class Tab3PageRoutingModule { }
