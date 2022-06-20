import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { AuthenticateService } from './auth/authenticate.service';
import { DtoMember, RoleDetail, TeamMate } from '../model/user-account.model';
import { DataService } from './data.service';
import { HotToastService } from '@ngneat/hot-toast';
import { CustomResponse } from '../model/custom-response.interface';

@Injectable({
  providedIn: 'root'
})
export class TeamNetworkService {

  _teamList: TeamMate[] = [
    // { id: 1, roleName: 'PM', firstName: 'Arjun', lastName: 'Bhopal', email: 'C.com', currentUser: false },
    // { id: 2, roleName: 'Dev', firstName: 'Michal', lastName: 'Samy', email: 'C.com', currentUser: false },
    // { id: 3, roleName: 'Senior Dev', firstName: 'Sharon', lastName: 'Stone', email: 'C.com', currentUser: false },
    // { id: 4, roleName: 'BA', firstName: 'Chee', lastName: 'Soon Tee', email: 'C.com', currentUser: false },
    // { id: 5, roleName: 'Front End', firstName: 'Lim', lastName: 'Alex', email: 'C.com', currentUser: false },
  ];

  constructor(
    private authService: AuthenticateService,
    private http: HttpClient,
    private toast: HotToastService,
  ) {

  }

  getTeamMates(id: number): Observable<TeamMate[]> {
    return this.http
      .get<TeamMate[]>(`${this.authService.api}/team/getTeam/${id}`, { headers: this.authService.getHeaders() });
  }

  getRoles() {
    return this.http
      .get<Array<RoleDetail>>(`${this.authService.api}/team/getNonAdminRoles`, { headers: this.authService.getHeaders() });
  }

  getMemberDetails(id: number, email: string) {
    return this.http
      .get<DtoMember>(`${this.authService.api}/team/getMemberDetails/${id}/${email}`, { headers: this.authService.getHeaders() });
  }

  addMember(member: DtoMember) {
    const params = new HttpParams()
      .append('ReportingToId', this.authService.getUserAccount().id);

    return this.http
      .post<CustomResponse>(`${this.authService.api}/team/addMember`, member, { headers: this.authService.getHeaders(), params: params });
  }

  editMember(member: DtoMember) {
    return this.http
      .put<CustomResponse>(`${this.authService.api}/team/editMember`, member, { headers: this.authService.getHeaders() });
  }

  deleteMember(id: number) {
    return this.http.delete<CustomResponse>(`${this.authService.api}/team/deleteMember/${id}`, { headers: this.authService.getHeaders() });
  }




}
