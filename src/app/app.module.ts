import { CUSTOM_ELEMENTS_SCHEMA, NgModule, Provider } from '@angular/core';
import { BrowserModule, Meta } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { MaterialModule } from './material/material.module';
import { HomeComponent } from './general/home/home.component';
import { ProfileComponent } from './general/profile/profile.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TodoTableComponent } from './case-studies/todo-table/todo-table.component';
import { LoginComponent } from './general/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DEFAULT_ERROR_MESSAGES, MinError, NgxMatErrorsModule, NGX_MAT_ERROR_DEFAULT_OPTIONS } from 'ngx-mat-errors';
import { HotToastModule } from '@ngneat/hot-toast';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { DialogBoxComponent } from './case-studies/todo-table/dialog-box/dialog-box.component';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { KanbanHeaderComponent } from './case-studies/kanban/kanban-header/kanban-header.component';
import { BoardComponent } from './case-studies/kanban/board/board.component';
import { BoardItemComponent } from './case-studies/kanban/board-item/board-item.component';
import { ColorPanelComponent } from './case-studies/kanban/color-panel/color-panel.component';
import { CommentItemComponent } from './case-studies/kanban/comment-item/comment-item.component';
import { CardDialogBoxComponent } from './case-studies/kanban/card-dialog-box/card-dialog-box.component';
import { ColumnDialogBoxComponent } from './case-studies/kanban/column-dialog-box/column-dialog-box.component';
import { ScheduleDialogBoxComponent } from './case-studies/kanban/schedule-dialog-box/schedule-dialog-box.component';
import { ScreenshotItemComponent } from './case-studies/kanban/screenshot-item/screenshot-item.component';
import { DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { TaskListComponent } from './work/task-list/task-list.component';
import { TaskDialogComponent } from './work/task-dialog/task-dialog.component';
import { TeamHomeComponent } from './work/team-home/team-home.component';
import { TeamMateDialogComponent } from './work/team-mate-dialog/team-mate-dialog.component';
import { ProjectComponent } from './work/project/project.component';
import { ProjectDialogComponent } from './work/project-dialog/project-dialog.component';
import { KanbanBoardComponent } from './work/kanban/kanban-board/kanban-board.component';
import { KHeaderComponent } from './work/kanban/k-header/k-header.component';
import { KColumnDialogComponent } from './work/kanban/k-column-dialog/k-column-dialog.component';
import { KCardComponent } from './work/kanban/k-card/k-card.component';
import { KCardDialogComponent } from './work/kanban/k-card-dialog/k-card-dialog.component';
import { KScheduleDialogComponent } from './work/kanban/k-schedule-dialog/k-schedule-dialog.component';
import { KCardCommentComponent } from './work/kanban/k-card-comment/k-card-comment.component';
import { DemoLoginDialogComponent } from './general/home/demo-login-dialog/demo-login-dialog.component';
import { AuthGuard } from './services/auth/auth.guard';


export const NGX_MAT_ERROR_DEFAULT_CONFIG: Provider = {
  useFactory: () => {
    return {
      ...DEFAULT_ERROR_MESSAGES,
      min: (error: MinError) =>
        `Min value is ${error.min}, actual is ${error.actual}`,
    };
  },
  provide: NGX_MAT_ERROR_DEFAULT_OPTIONS,
};

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    ProfileComponent,
    TodoTableComponent,
    LoginComponent,
    DialogBoxComponent,
    KanbanHeaderComponent,
    BoardComponent,
    BoardItemComponent,
    ColorPanelComponent,
    CommentItemComponent,
    CardDialogBoxComponent,
    ColumnDialogBoxComponent,
    ScheduleDialogBoxComponent,
    ScreenshotItemComponent,
    TaskListComponent,
    TaskDialogComponent,
    TeamHomeComponent,
    TeamMateDialogComponent,
    //HideCantEditDirective,
    ProjectComponent,
    ProjectDialogComponent,
    KanbanBoardComponent,
    KHeaderComponent,
    KColumnDialogComponent,
    KCardComponent,
    KCardDialogComponent,
    KScheduleDialogComponent,
    KCardCommentComponent,
    DemoLoginDialogComponent,

  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    FlexLayoutModule,
    NgxMatErrorsModule,
    HotToastModule.forRoot(),
    SweetAlert2Module.forRoot(),
  ],
  exports: [

  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    NGX_MAT_ERROR_DEFAULT_CONFIG,
    DatePipe,
    AuthGuard,
    Meta,
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }
