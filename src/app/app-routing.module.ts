import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {IndexComponent} from './pages/index/index.component';
import {RootComponent} from './components/root/root.component';
import {TranslatorApiComponent} from './pages/browser-ai/translator-api/translator-api.component';
import {
  WritingAssistanceApisComponent
} from './pages/browser-ai/writing-assistance-apis/writing-assistance-apis.component';

const routes: Routes = [
  {
    path: "",
    component: RootComponent,
    children: [
      {
        path: "",
        component: IndexComponent,
      },
      {
        path: "browser-ai",
        children: [
          {
            path: "translator-api",
            component: TranslatorApiComponent
          },
          {
            path: "writing-assistance-apis",
            component: WritingAssistanceApisComponent
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
