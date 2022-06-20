import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HotToastService } from '@ngneat/hot-toast';
import { DialogBoxComponent } from 'src/app/case-studies/todo-table/dialog-box/dialog-box.component';
import { AuthenticateService } from 'src/app/services/auth/authenticate.service';
import { ProjectService } from 'src/app/services/project.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-project-dialog',
  templateUrl: './project-dialog.component.html',
  styleUrls: ['./project-dialog.component.scss']
})
export class ProjectDialogComponent implements OnInit {

  projectForm !: FormGroup;
  action: string = '';

  constructor(
    private _formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<DialogBoxComponent>,
    private projectService: ProjectService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private toast: HotToastService,
    private datePipe: DatePipe,
    private authService: AuthenticateService,
  ) { }

  get activeID() {
    return this.authService.getUserAccount().id;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.projectForm = this._formBuilder.group({
      id: [''],
      leaderId: [''],
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
    });

    if (!this.data.project) {
      this.action = 'Add Project';
      this.projectForm.controls['leaderId'].setValue(this.activeID);
    } else {
      this.action = 'Edit Project';
      this.projectForm.controls['id'].setValue(this.data.project.id);
      this.projectForm.controls['leaderId'].setValue(this.data.project.leaderId);
      this.projectForm.controls['name'].setValue(this.data.project.name);
      this.projectForm.controls['description'].setValue(this.data.project.description);
      this.projectForm.controls['startDate'].setValue(this.data.project.startDate);
    }
  }

  onSubmit() {
    if (this.projectForm.invalid) {
      return;
    }
    if (!this.data.project) {
      // add Project
      this.postAddNewProject();
    }
    else {
      // edit Project
      this.putEditProject();
    }
  }

  postAddNewProject() {
    this.projectService.postAddNewProject(this.projectForm.value)
    .subscribe({
      next:(res) => {
        if (res.statusCode != 200) {
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            showConfirmButton: true,
            confirmButtonColor: 'red',
            html: res.message,
            //timer: 2500
          });
        }
        else {
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            showConfirmButton: false,
            html: res.message,
            timer: 2500
          });              
          this.projectForm.reset();
          this.dialogRef.close('success');
        }
      },
      error:() => { this.toast.error('An Error occured while posting postAddNewProject.', { duration: 3000, dismissible: true });  }
    });
  }

  putEditProject() {
    this.projectService.putEditProject(this.projectForm.value)
    .subscribe({
      next:(res) => {
        if (res.statusCode != 200) {
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            showConfirmButton: true,
            confirmButtonColor: 'red',
            html: res.message,
            //timer: 2500
          });
        }
        else {
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            showConfirmButton: false,
            html: res.message,
            timer: 2500
          });              
          this.projectForm.reset();
          this.dialogRef.close('success');
        }
      },
      error:() => { this.toast.error('An Error occured while posting putEditProject.', { duration: 3000, dismissible: true });  }
    });
  }

}
