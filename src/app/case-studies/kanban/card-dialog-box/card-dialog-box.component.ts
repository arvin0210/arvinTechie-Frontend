import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { KanbanBoardService } from 'src/app/services/kanban-board.service';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-card-dialog-box',
  templateUrl: './card-dialog-box.component.html',
  styleUrls: ['./card-dialog-box.component.scss']
})
export class CardDialogBoxComponent implements OnInit {

  public _newCardForm !: FormGroup;
  constructor(
    private _formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<CardDialogBoxComponent>,
    private _boardService: KanbanBoardService,
    private toastService: HotToastService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this._newCardForm = this._formBuilder.group({
      // columnId: [this.data.columnId],
      cardTitle: ['', [Validators.required]],
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this._newCardForm?.invalid) {
      return;
    }
    const cardTitle = this._newCardForm?.get('cardTitle')?.value;
    if (cardTitle) {
      this._boardService.addCard(cardTitle, this.data.columnId);
      this.dialogRef.close();
      this.toastService.success("Successfully created Card : <strong>" + cardTitle + "</strong>");
    }
  }

}
