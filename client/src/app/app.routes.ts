import { Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { MemberListComponent } from './components/member/member-list/member-list.component';
import { MemberDetailComponent } from './components/member/member-detail/member-detail.component';
import { MemberEditComponent } from './components/member/member-edit/member-edit.component';
import { ListsComponent } from './components/lists/lists.component';
import { MessagesComponent } from './components/messages/messages.component';

import { NotFoundComponent } from './errors/not-found/not-found.component';
import { ServerErrorComponent } from './errors/server-error/server-error.component';

import { authGuard } from './guards/auth.guard';
import { preventUnsavedChangesGuard } from './guards/prevent-unsaved-changes.guard';
import { memberDetailedResolver } from './resolvers/member-detailed.resolver';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [authGuard],
    children: [
      {
        path: 'members',
        component: MemberListComponent,
        canActivate: [authGuard],
      },
      {
        path: 'members/:username',
        component: MemberDetailComponent,
        resolve: { member: memberDetailedResolver },
      },
      {
        path: 'member/edit',
        component: MemberEditComponent,
        canDeactivate: [preventUnsavedChangesGuard],
      },
      { path: 'lists', component: ListsComponent },
      { path: 'messages', component: MessagesComponent },
    ],
  },
  { path: 'not-found', component: NotFoundComponent },
  { path: 'server-error', component: ServerErrorComponent },
  { path: '**', component: HomeComponent, pathMatch: 'full' },
];
