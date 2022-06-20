import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HotToastService } from '@ngneat/hot-toast';
import { KanbanBoardService } from 'src/app/services/kanban-board.service';

@Component({
  selector: 'app-schedule-dialog-box',
  templateUrl: './schedule-dialog-box.component.html',
  styleUrls: ['./schedule-dialog-box.component.scss']
})
export class ScheduleDialogBoxComponent implements OnInit {

  public _ScheduleForm !: FormGroup;
  public currentProgress: number = 0;
  public cardTitle: string = '';
  constructor(
    private _formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<ScheduleDialogBoxComponent>,
    public _boardService: KanbanBoardService,
    private toastService: HotToastService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.cardTitle = this._boardService.getCard_Title(this.data.columnId, this.data.cardId);
    this.currentProgress = this.data.progress;
    this._ScheduleForm = this._formBuilder.group({
      progress: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      progressComment: ['', [Validators.required]],
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this._ScheduleForm?.invalid) {
      return;
    }
    const progress = this._ScheduleForm?.get('progress')?.value;
    const progressComment = this._ScheduleForm?.get('progressComment')?.value;
    if (progress != this.data.progress) {
      this._boardService.changeCardProgress(this.data.columnId, this.data.cardId, progress, progressComment);
      this.toastService.success("Card : <strong>" + this.cardTitle + "</strong> Progress updated");
      this.dialogRef.close();
    }
    else {
      this.toastService.warning("Card : <strong>" + this.cardTitle + "</strong> Progress unchanged");
      this.dialogRef.close();
    }
    
  }

}
