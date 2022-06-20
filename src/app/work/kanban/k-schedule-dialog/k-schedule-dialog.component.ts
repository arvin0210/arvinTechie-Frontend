import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HotToastService } from '@ngneat/hot-toast';
import { AuthenticateService } from 'src/app/services/auth/authenticate.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-k-schedule-dialog',
  templateUrl: './k-schedule-dialog.component.html',
  styleUrls: ['./k-schedule-dialog.component.scss']
})
export class KScheduleDialogComponent implements OnInit {

  public ScheduleForm !: FormGroup;
  public currentProgress: number = 0;
  public cardTitle: string = '';
  constructor(
    private _formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<KScheduleDialogComponent>,
    public dataService: DataService,
    private toastService: HotToastService,
    private authService: AuthenticateService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  get activeID() {
    return this.authService.getUserAccount().id;
  }

  ngOnInit(): void {
    this.cardTitle = this.data.cardTitle;
    this.currentProgress = this.data.progress;
    this.ScheduleForm = this._formBuilder.group({
      progress: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      progressComment: ['', [Validators.required]],
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.ScheduleForm?.invalid) {
      return;
    }
    const progress = this.ScheduleForm?.get('progress')?.value;
    const progressComment = this.ScheduleForm?.get('progressComment')?.value;
    if (progress != this.data.progress) {
      this.dataService.postCardScheduleChange(this.data.cardId, progress, progressComment, this.activeID).subscribe({
        next: (res) => {
          if (res.statusCode == 200) {
            this.toastService.success("Card : <strong>" + this.cardTitle + "</strong> Progress updated");
            this.dialogRef.close("success");
          }
        }
      });

    }
    else {
      this.toastService.warning("Card : <strong>" + this.cardTitle + "</strong> Progress unchanged");
      this.dialogRef.close();
    }

  }

}
