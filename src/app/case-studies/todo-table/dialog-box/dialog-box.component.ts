import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TodoListService } from 'src/app/services/todo-list.service';

@Component({
  selector: 'app-dialog-box',
  templateUrl: './dialog-box.component.html',
  styleUrls: ['./dialog-box.component.scss']
})
export class DialogBoxComponent implements OnInit {

  public _todoForm !: FormGroup;
  action: string = '';

  constructor(
    private _formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<DialogBoxComponent>,
    private _todoService: TodoListService,
    //@Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {

    this._todoForm = this._formBuilder.group({
      id: [!this.data.todo ? '' : this.data.todo.id],
      description: [!this.data.todo ? '' : this.data.todo.description, [Validators.required]],
      targetDate: [!this.data.todo ? '' : this.data.todo.targetDate, [Validators.required]],
      done: [!this.data.todo ? false : this.data.todo.done, [Validators.required]],
    });

    if (!this.data.todo) {
      this.action = 'Add List';
    } else {
      this.action = 'Edit List';
    }
    
  }

  onSubmit() {
    if (this._todoForm.invalid) {
      return;
    }
    if (!this.data.todo) {
      this._todoService.addList(this._todoForm.value);
      this.dialogRef.close();
    } else {
      this._todoService.editList(this._todoForm.value);
      this.dialogRef.close();
    }
  }

}
