import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyDetailComponent } from './my-detail/my-detail.component';
import { Tab2Page } from './tab2.page';

const routes: Routes = [
    {
        path: '',
        component: Tab2Page,
    },
    {
        path: 'my-detail',
        component: MyDetailComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class Tab2PageRoutingModule { }
