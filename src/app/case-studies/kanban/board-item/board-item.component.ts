import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Card } from 'src/app/model/kanban.model';

@Component({
  selector: 'app-board-item',
  templateUrl: './board-item.component.html',
  styleUrls: ['./board-item.component.scss']
})
export class BoardItemComponent implements OnInit {

  @Input('item') item!: Card;
  @Input('screenshot') screenshot!: boolean;
  @Output() emitText: EventEmitter<{ id: number; text: string }> = new EventEmitter();
  @Output() emitDeleteCard: EventEmitter<number> = new EventEmitter();
  @Output() emitCardSchedule: EventEmitter<number> = new EventEmitter();

  commentInput = ''
  open = false;
  constructor() { }

  ngOnInit(): void {
    
   }

  onOpenComment() {
    this.open = !this.open;
  }

  onCommentTextEmit(id: number) {
    this.emitText.emit({ id, text: this.commentInput });
    this.commentInput = ''
  }

  onCardDelete(id: number) {
    this.emitDeleteCard.emit(id)
  }

  onCardSchedule(id: number) {
    this.emitCardSchedule.emit(id)
  }

}
