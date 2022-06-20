import { DatePipe } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { CustomResponse } from '../model/custom-response.interface';
import { Project } from '../model/kanban.model';
import { AuthenticateService } from './auth/authenticate.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  _projects$ = new BehaviorSubject<any>(null);

  constructor(private authService: AuthenticateService, private http: HttpClient) { }

  populateProjects(projects?: Project[]) { this._projects$.next(projects); }

  getAllProjects(activeID: number, pageNo?: number, pageSize?: number) {
    if (!pageNo)
      pageNo = 0;
    if (!pageSize)
      pageSize = 20;
    return this.http
      .get<CustomResponse>(`${this.authService.api}/project/getAllProjects/${activeID}/${pageNo}/${pageSize}`, { headers: this.authService.getHeaders() });
  }

  getProject(activeID: number, projectId: number) {
    return this.http.get<CustomResponse>(`${this.authService.api}/project/getProject/${activeID}/${projectId}`, { headers: this.authService.getHeaders() });
  }
  postAddNewProject(project: Project) {
    return this.http.post<CustomResponse>(`${this.authService.api}/project/addProject`, project, { headers: this.authService.getHeaders() });
  }
  putEditProject(project: Project) {
    return this.http.put<CustomResponse>(`${this.authService.api}/project/editProject`, project, { headers: this.authService.getHeaders() });
  }
  deleteProject(project: Project) {
    return this.http.delete<CustomResponse>(`${this.authService.api}/project/deleteProject/${project.id}`, { headers: this.authService.getHeaders() });
  }

}

