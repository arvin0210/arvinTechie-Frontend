import { DatePipe } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { CustomResponse } from '../model/custom-response.interface';
import { TaskList } from '../model/task.model';
import { AuthenticateService } from './auth/authenticate.service';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(
    private authService: AuthenticateService,
    private http: HttpClient,
    private toast: HotToastService,
    private datePipe: DatePipe,
  ) {

  }

  get activeID() {
    return this.authService.getUserAccount().id;
  }

  postTask(data: TaskList) {
    var targetDateString: string = this.datePipe.transform(data.targetDate, "yyyy-MM-dd") || '';
    const headers = { 'content-type': 'application/json' };
    const params = new HttpParams()
      .append('user_account_id', this.activeID)
      .append('description', data.description)
      .append('targetDate', targetDateString);
    const body = "";
    return this.http.post<any>(`${this.authService.api}/task/addNewTask`, body, { headers: this.authService.getHeaders(), params: params });
  }

  putTask(data: TaskList) {
    var targetDateString: string = this.datePipe.transform(data.targetDate, "yyyy-MM-dd") || '';
    const id = data.id;
    const params = new HttpParams()
      .append('id', id)
      .append('description', data.description)
      .append('targetDate', targetDateString)
      .append('completion', data.completed);
    const body = "";
    return this.http.put<any>(`${this.authService.api}/task/editTask/${id}`, body, { headers: this.authService.getHeaders(), params: params });
  }

  deleteTask(id: number) {
    return this.http.delete<any>(`${this.authService.api}/task/deleteTask/${id}`, { headers: this.authService.getHeaders() });
  }

  getAllTasks() {
    var dateCheck = new Date();
    dateCheck.setDate(dateCheck.getDate() + 7);

    return this.http
      .get<TaskList[]>(`${this.authService.api}/task/getTaskList/${this.activeID}`, { headers: this.authService.getHeaders() })
      .pipe(
        map(data => {
          const valt = data as TaskList[];
          valt.sort((a, b) => a.targetDate < b.targetDate ? -1 : 1);
          valt.map(rtn => {
            if (new Date(rtn.targetDate) < dateCheck && !rtn.completed)
              rtn.highlighted = true;
            else
              rtn.highlighted = false;
            return rtn;
          })
          return valt;
        })
      );
  }


}
