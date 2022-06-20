import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HotToastService } from '@ngneat/hot-toast';
import { DialogBoxComponent } from 'src/app/case-studies/todo-table/dialog-box/dialog-box.component';
import { TeamMate } from 'src/app/model/user-account.model';
import { AuthenticateService } from 'src/app/services/auth/authenticate.service';
import { DataService } from 'src/app/services/data.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-k-column-dialog',
  templateUrl: './k-column-dialog.component.html',
  styleUrls: ['./k-column-dialog.component.scss']
})
export class KColumnDialogComponent implements OnInit {

  swimLaneForm !: FormGroup;
  action: string = '';
  teamMates !: TeamMate[];

  constructor(
    private _formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<DialogBoxComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private toast: HotToastService,
    private datePipe: DatePipe,
    private authService: AuthenticateService,
    private dataService: DataService,
  ) { }

  get isAdmin() {
    return this.authService.isAdmin;
  }

  get activeID() {
    return this.authService.getUserAccount().id;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.teamMates = this.data.teamMates;

    this.swimLaneForm = this._formBuilder.group({
      projectId: [this.data.projectId],
      id: [''],
      userId: ['', [Validators.required]],
      userName: [''],
      roleName: [''],
      color: ['', [Validators.required]],
      sortIndex: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
    });

    if (!this.data.swimLane) {
      this.action = 'Add Column';
    } else {
      this.action = 'Edit Column';
      this.swimLaneForm.controls['id'].setValue(this.data.swimLane.id);
      this.swimLaneForm.controls['userId'].setValue(this.data.swimLane.userId);
      this.swimLaneForm.controls['userName'].setValue(this.data.swimLane.userName);
      this.swimLaneForm.controls['roleName'].setValue(this.data.swimLane.roleName);
      this.swimLaneForm.controls['color'].setValue(this.data.swimLane.color);
      this.swimLaneForm.controls['sortIndex'].setValue(this.data.swimLane.sortIndex);
      if (!this.isAdmin) {
        this.swimLaneForm.controls['userId'].disable();
        this.swimLaneForm.controls['userName'].disable();
        this.swimLaneForm.controls['roleName'].disable();
        this.swimLaneForm.controls['sortIndex'].disable();
      }
    }
  }

  onSubmit() {
    if (this.swimLaneForm.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        showConfirmButton: true,
        confirmButtonColor: 'red',
        html: "Form not filled properly. Please check.",
        //timer: 2500
      });
      return;
    }
    switch (this.action) {
      case 'Add Column': this.postNewSwimLane(); break;
      case 'Edit Column':
        if (this.isAdmin)
          this.putExistSwimLane();
        else
          this.putExistSwimLaneNonAdmin();
        break;
      default: break;
    }
  }

  postNewSwimLane() {
    this.dataService.postNewSwimLane(this.activeID, this.swimLaneForm.value).subscribe({
      next: (res) => {
        if (res.statusCode == 200) {
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            showConfirmButton: false,
            html: res.message,
            timer: 2500
          });
          this.dataService.getAllSwimLanes(this.data.projectId);
          this.swimLaneForm.reset();
          this.dialogRef.close('success');
        }
        else
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            showConfirmButton: true,
            confirmButtonColor: 'red',
            html: res.message,
            //timer: 2500
          });
      }
    });
  }
  putExistSwimLane() {
    this.dataService.putExistSwimLane(this.activeID, this.swimLaneForm.value).subscribe({
      next: (res) => {
        if (res.statusCode == 200) {
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            showConfirmButton: false,
            html: res.message,
            timer: 2500
          });
          this.dataService.getAllSwimLanes(this.data.projectId);
          this.swimLaneForm.reset();
          this.dialogRef.close('success');
        }
        else
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            showConfirmButton: true,
            confirmButtonColor: 'red',
            html: res.message,
            //timer: 2500
          });
      }
    });
  }
  putExistSwimLaneNonAdmin() {
    this.dataService.putExistSwimLaneNonAdmin(this.activeID, this.swimLaneForm.value).subscribe({
      next: (res) => {
        if (res.statusCode == 200) {
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            showConfirmButton: false,
            html: res.message,
            timer: 2500
          });
          this.dataService.getAllSwimLanes(this.data.projectId);
          this.swimLaneForm.reset();
          this.dialogRef.close('success');
        }
        else
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            showConfirmButton: true,
            confirmButtonColor: 'red',
            html: res.message,
            //timer: 2500
          });
      }
    });
  }

}
