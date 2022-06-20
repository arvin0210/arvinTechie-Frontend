import { DatePipe } from '@angular/common';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { CustomResponse } from '../model/custom-response.interface';
import { DropperCDK, SwimLane } from '../model/kanban.model';
import { AuthenticateService } from './auth/authenticate.service';
import { Card } from '../model/kanban.model';



@Injectable({
  providedIn: 'root'
})
export class DataService {

  private board$ = new BehaviorSubject<SwimLane[]>([]);

  constructor(private authService: AuthenticateService, private http: HttpClient) { }

  getBoard$() {
    return this.board$;
  }

  handleError(handleError: HttpErrorResponse): Observable<never> {
    console.log(handleError);
    return throwError(`An error occured - Error code: ${handleError.status}`);
  }

  // Updates board$
  getAllSwimLanes(projectId: number) {
    this.http
      .get<SwimLane[]>(`${this.authService.api}/swimLane/getAllSwimLanes/${projectId}`, { headers: this.authService.getHeaders() })
      .subscribe({
        next: (res) => {
          this.board$.next(res);
        },
      });
  }

  postNewSwimLane(activeID: number, swimLane: SwimLane) {
    const params = new HttpParams()
      .append('activeID', activeID);

    return this.http.post<CustomResponse>(`${this.authService.api}/swimLane/addNewSwimLane`, swimLane, { headers: this.authService.getHeaders(), params: params });
  }
  putExistSwimLane(activeID: number, swimLane: SwimLane) {
    return this.http.put<CustomResponse>(`${this.authService.api}/swimLane/putExistSwimLane/${activeID}`, swimLane, { headers: this.authService.getHeaders() });
  }
  putExistSwimLaneNonAdmin(activeID: number, swimLane: SwimLane) {
    return this.http.put<CustomResponse>(`${this.authService.api}/swimLane/putExistSwimLaneNonAdmin/${activeID}`, swimLane, { headers: this.authService.getHeaders() });
  }
  deleteSwimLane(swimLane: SwimLane, projectId: number) {
    return this.http.delete<CustomResponse>(`${this.authService.api}/swimLane/deleteSwimLane/${projectId}/${swimLane.id}`, { headers: this.authService.getHeaders() });
  }

  postNewCard(card: Card, activeID: number) {
    const params = new HttpParams()
      .append('activeID', activeID)
      .append('swimLaneId', card.swimLaneId)
      .append('cardTitle', card.text)
      .append('progress', card.progress);

    return this.http.post<CustomResponse>(`${this.authService.api}/card/addNewCard`, "", { headers: this.authService.getHeaders(), params: params });
  }

  deleteCard(cardId: number, activeID: number) {
    return this.http.delete<CustomResponse>(`${this.authService.api}/card/deleteCard/${cardId}/${activeID}`, { headers: this.authService.getHeaders() });
  }

  postUpdateCDKList(dropper: DropperCDK[]) {
    return this.http.post<CustomResponse>(`${this.authService.api}/card/updateCDKDropList`, dropper, { headers: this.authService.getHeaders() });
  }

  postCardScheduleChange(cardId: number, progress: number, progressComment: string, activeID: number) {
    const params = new HttpParams()
      .append('activeID', activeID)
      .append('cardId', cardId)
      .append('progress', progress)
      .append('progressComment', progressComment);

    return this.http.post<CustomResponse>(`${this.authService.api}/card/cardScheduleChange`, "", { headers: this.authService.getHeaders(), params: params });
  }

  postCommentToCard(cardId: number, commentText: string, activeID: number) {
    const params = new HttpParams()
      .append('activeID', activeID)
      .append('cardId', cardId)
      .append('commentText', commentText);
    return this.http.post<CustomResponse>(`${this.authService.api}/comment/CommentToCard`, "", { headers: this.authService.getHeaders(), params: params });
  }

  deleteComment(commentId: number, activeID: number) {
    return this.http.delete<CustomResponse>(`${this.authService.api}/comment/deleteComment/${commentId}/${activeID}`, { headers: this.authService.getHeaders() });
  }



}
