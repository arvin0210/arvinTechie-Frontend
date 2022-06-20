import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Comment } from '../../../model/kanban.model';

@Component({
  selector: 'app-comment-item',
  templateUrl: './comment-item.component.html',
  styleUrls: ['./comment-item.component.scss']
})
export class CommentItemComponent implements OnInit {

  @Input() comment !: Comment;
  @Input('screenshot') screenshot!: boolean;
  @Output() emitComment: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  onCommentEmit(comment: Comment) {
    this.emitComment.emit(comment);
  }

}
