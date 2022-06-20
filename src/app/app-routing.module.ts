import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BoardComponent } from './case-studies/kanban/board/board.component';
import { TodoTableComponent } from './case-studies/todo-table/todo-table.component';
import { HomeComponent } from './general/home/home.component';
import { LoginComponent } from './general/login/login.component';
import { ProfileComponent } from './general/profile/profile.component';
import { AuthGuard } from './services/auth/auth.guard';
import { KanbanBoardComponent } from './work/kanban/kanban-board/kanban-board.component';
import { ProjectComponent } from './work/project/project.component';
import { TaskListComponent } from './work/task-list/task-list.component';
import { TeamHomeComponent } from './work/team-home/team-home.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'login', component: LoginComponent },
  { path: 'cs-todoTable', component: TodoTableComponent },
  { path: 'cs-kanban/:projectId', component: BoardComponent },
  
  { path: 'work-taskList', component: TaskListComponent, canActivate: [AuthGuard] },
  { path: 'work-teamHome', component: TeamHomeComponent, canActivate: [AuthGuard] },
  { path: 'work-project', component: ProjectComponent, canActivate: [AuthGuard] },
  { path: 'work-kanban/:projectId', component: KanbanBoardComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
