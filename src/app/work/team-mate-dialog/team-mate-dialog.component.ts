import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HotToastService } from '@ngneat/hot-toast';
import { DialogBoxComponent } from 'src/app/case-studies/todo-table/dialog-box/dialog-box.component';
import { RoleDetail } from 'src/app/model/user-account.model';
import { AuthenticateService } from 'src/app/services/auth/authenticate.service';
import { TeamNetworkService } from 'src/app/services/team-network.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-team-mate-dialog',
  templateUrl: './team-mate-dialog.component.html',
  styleUrls: ['./team-mate-dialog.component.scss']
})
export class TeamMateDialogComponent implements OnInit {

  teamForm !: FormGroup;
  roles !: Array<RoleDetail>;
  action: string = '';

  constructor(
    private _formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<DialogBoxComponent>,
    private teamService: TeamNetworkService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private toast: HotToastService,
    private datePipe: DatePipe,
    private authService: AuthenticateService,
  ) { }

  get canChangeRoleSelection() {
    if (this.authService.isAdmin && this.data.member.id == this.authService.getUserAccount().id)
      return true;
    else
      return false;
    //[disabled]="!canChangeRoleSelection"
  }

  ngOnInit(): void {

    this.roles = this.data.roles;

    this.teamForm = this._formBuilder.group({
      id: [''],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      status: [true],
      email: ['', [Validators.required, Validators.email]],
      roleId: ['', [Validators.required]],
      userLoginUserName: ['', [Validators.required]],
    });

    if (!this.data.member) {
      this.action = 'Add Member';
    } else {
      this.action = 'Edit Member';;
      this.teamForm.controls['id'].setValue(this.data.member.id);
      this.teamForm.controls['firstName'].setValue(this.data.member.firstName);
      this.teamForm.controls['lastName'].setValue(this.data.member.lastName);
      this.teamForm.controls['status'].setValue(this.data.member.status);
      this.teamForm.controls['email'].setValue(this.data.member.email);
      this.teamForm.controls['roleId'].setValue(this.data.member.roleId);
      if (this.canChangeRoleSelection)
        this.teamForm.controls['roleId'].disable();
      this.teamForm.controls['roleId'].setValue(this.data.member.roleId)
      this.teamForm.controls['userLoginUserName'].setValue(this.data.member.userLoginUserName);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.teamForm.invalid) {
      return;
    }
    // new member
    if (!this.data.member) {
      this.teamService.addMember(this.teamForm.value)
        .subscribe({
          next: (res) => {
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
              this.teamForm.reset();
              this.dialogRef.close('success');
            }
          },
          error: () => { this.toast.error('An Error occured while executing addMember.', { duration: 3000, dismissible: true }); }
        });
    }
    else { // edit member
      this.teamService.editMember(this.teamForm.value)
        .subscribe({
          next: (res) => {
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
              this.teamForm.reset();
              this.dialogRef.close('success');
            }
          },
          error: () => { this.toast.error('An Error occured while executing addMember.', { duration: 3000, dismissible: true }); }
        });
    }
  }

}
