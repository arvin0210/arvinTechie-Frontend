import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Comment } from '../../../model/kanban.model';

@Component({
  selector: 'app-k-card-comment',
  templateUrl: './k-card-comment.component.html',
  styleUrls: ['./k-card-comment.component.scss']
})
export class KCardCommentComponent implements OnInit {

  @Input('comment') comment !: Comment;
  @Input('swimLaneColor') swimLaneColor !: string;
  @Output() emitComment: EventEmitter<any> = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
    
  }

  onCommentEmit(comment: Comment) {
    this.emitComment.emit(comment);
  }

}
