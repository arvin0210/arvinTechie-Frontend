import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HotToastService } from '@ngneat/hot-toast';
import { DialogBoxComponent } from 'src/app/case-studies/todo-table/dialog-box/dialog-box.component';
import { TaskService } from 'src/app/services/task.service';
import { TodoListService } from 'src/app/services/todo-list.service';

@Component({
  selector: 'app-task-dialog',
  templateUrl: './task-dialog.component.html',
  styleUrls: ['./task-dialog.component.scss']
})
export class TaskDialogComponent implements OnInit {

  public taskForm !: FormGroup;
  action: string = '';

  constructor(
    private _formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<DialogBoxComponent>,
    private taskService: TaskService,
    //@Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private toast: HotToastService,
    private datePipe: DatePipe,
  ) {

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {

    this.taskForm = this._formBuilder.group({
      id: [''],
      description: ['', [Validators.required]],
      targetDate: ['', [Validators.required]],
      completed: [false, [Validators.required]],
    });

    if (!this.data.element) {
      this.action = 'Add List';
    } else {
      this.action = 'Edit List';
      this.taskForm.controls['id'].setValue(this.data.element.id);
      this.taskForm.controls['description'].setValue(this.data.element.description);
      this.taskForm.controls['targetDate'].setValue(this.data.element.targetDate);
      this.taskForm.controls['completed'].setValue(this.data.element.completed);
    }

  }

  onSubmit() {
    if (this.taskForm.invalid) {
      return;
    }
    const desc = this.taskForm.controls['description'].value;
    if (!this.data.element) {
      this.taskService.postTask(this.taskForm.value)
        .subscribe({
          next: (res) => { this.toast.success(`New Task added: ${desc}`, { duration: 3000, dismissible: true }); },
          error: () => { this.toast.error('An Error occured while execution.', { duration: 3000, dismissible: true }); }
        });
      this.taskForm.reset();
      this.dialogRef.close('success');
    } else {
      this.taskService.putTask(this.taskForm.value)
        .subscribe({
          next: (res) => { this.toast.success(`Task edited: ${desc}`, { duration: 3000, dismissible: true }); },
          error: () => { this.toast.error('An Error occured while execution.', { duration: 3000, dismissible: true }); }
        });
      this.taskForm.reset();
      this.dialogRef.close('success');
    }
  }

}
