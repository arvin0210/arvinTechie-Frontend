import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Card } from 'src/app/model/kanban.model';

@Component({
  selector: 'app-k-card',
  templateUrl: './k-card.component.html',
  styleUrls: ['./k-card.component.scss']
})
export class KCardComponent implements OnInit {

  @Input('card') card!: Card;
  @Output() emitText: EventEmitter<{ id: number; text: string }> = new EventEmitter();
  @Output() emitEditCard: EventEmitter<number> = new EventEmitter();
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

  onCardEdit(id: number) {
    this.emitEditCard.emit(id)
  }
  onCardDelete(id: number) {
    this.emitDeleteCard.emit(id)
  }

  onCardSchedule(id: number) {
    this.emitCardSchedule.emit(id)
  }

}
