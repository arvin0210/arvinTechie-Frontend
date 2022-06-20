import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HotToastService } from '@ngneat/hot-toast';
import { CardDialogBoxComponent } from 'src/app/case-studies/kanban/card-dialog-box/card-dialog-box.component';
import { AuthenticateService } from 'src/app/services/auth/authenticate.service';
import { DataService } from 'src/app/services/data.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-k-card-dialog',
  templateUrl: './k-card-dialog.component.html',
  styleUrls: ['./k-card-dialog.component.scss']
})
export class KCardDialogComponent implements OnInit {

  CardForm !: FormGroup;
  action: string = '';
  currentProgress: number = 0;

  constructor(
    private _formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<CardDialogBoxComponent>,
    private authService: AuthenticateService,
    private toastService: HotToastService,
    private dataService: DataService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.CardForm = this._formBuilder.group({
      swimLaneId: [''],
      id: [''],
      text: ['', [Validators.required]],
      progress: ['', [Validators.pattern("^[0-9]*$")]],
    });

    if (!this.data.card) {
      this.action = 'Add Card';
      this.CardForm.controls['swimLaneId'].setValue(this.data.swimLane.id);
    } else {
      this.action = 'Edit Card';
      this.currentProgress = this.data.card.progress;
      this.CardForm.controls['swimLaneId'].setValue(this.data.swimLane.id);
      this.CardForm.controls['id'].setValue(this.data.card.id);
      this.CardForm.controls['text'].setValue(this.data.card.text);
      this.CardForm.controls['progress'].setValue(this.data.card.progress);
    }
  }

  get activeID() {
    return this.authService.getUserAccount().id;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.CardForm?.invalid) {
      return;
    }

    switch(this.action) {
      case 'Add Card': this.PostNewCardRequest(); break;
      // case 'Edit Card': this.PutExistingCardRequest(); break;
      default: break;
    }
    
  }

  PostNewCardRequest() {
    this.dataService.postNewCard(this.CardForm.value, this.activeID).subscribe({
      next: (res) => {
        if (res.statusCode == 200) {
          this.CardForm.reset();
          this.dialogRef.close("success");
          this.toastService.success(res.message);
        }
        else {
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            showConfirmButton: true,
            confirmButtonColor: 'red',
            html: res.message,
            //timer: 2500
          });
        }
      }
    });
  }

  // PutExistingCardRequest() {
  //   this.dataService.postNewCard(this.CardForm.value, this.activeID).subscribe({
  //     next: (res) => {
  //       if (res.statusCode == 200) {
  //         this.CardForm.reset();
  //         this.dialogRef.close("success");
  //         this.toastService.success(res.message);
  //       }
  //       else {
  //         Swal.fire({
  //           icon: 'error',
  //           title: 'Error!',
  //           showConfirmButton: true,
  //           confirmButtonColor: 'red',
  //           html: res.message,
  //           //timer: 2500
  //         });
  //       }
  //     }
  //   });
  // }

}
