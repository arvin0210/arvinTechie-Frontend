import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HotToastService } from '@ngneat/hot-toast';
import { KanbanBoardService } from 'src/app/services/kanban-board.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-column-dialog-box',
  templateUrl: './column-dialog-box.component.html',
  styleUrls: ['./column-dialog-box.component.scss']
})
export class ColumnDialogBoxComponent implements OnInit {

  public _newColumnForm !: FormGroup;
  public action: string = '';
  constructor(
    private _formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<ColumnDialogBoxComponent>,
    public _boardService: KanbanBoardService,
    private toastService: HotToastService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    //console.log(this.data);

    if (this.data.columnId) {
      this.action = 'Edit Column';
    }
    else {
      this.action = 'Add New Column';
    }

    this._newColumnForm = this._formBuilder.group({
      columnTitle: [!this.data.columnTitle ? '' : this.data.columnTitle, [Validators.required]],
      columnRoleName: [!this.data.columnTitle ? '' : this.data.columnRoleName, [Validators.required]],
      columnIndex: [!this.data.columnIndex ? '' : this.data.columnIndex, [Validators.required, Validators.pattern("^[0-9]*$")]],
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this._newColumnForm?.invalid) {
      return;
    }
    const columnTitle = this._newColumnForm?.get('columnTitle')?.value;
    const columnIndex = this._newColumnForm?.get('columnIndex')?.value;
    const columnRoleName = this._newColumnForm?.get('columnRoleName')?.value;

    if (!this.data.columnId) {
      // new record
      this._boardService.addColumn(columnTitle, columnRoleName, columnIndex, this.data.projectId);
      this.dialogRef.close();
      this.toastService.success("Successfully created Column : <strong>" + columnTitle + "</strong>");
    } else {
      // old record
      if (this.columnIndexExist(this.data.projectId, this.data.columnIndex, columnIndex)) {
        Swal.fire({
          icon: 'error',
          title: 'Conflict!',
          showConfirmButton: true,
          confirmButtonColor: 'red',
          html: 'Column Index: ' + columnIndex + ' exist for another column. Please try next increment index',
        });
      }
      else {
        this._boardService.editColumn(this.data.columnId, columnTitle, columnRoleName, columnIndex);
        this.dialogRef.close();
        this.toastService.success("Successfully edited Column : <strong>" + columnTitle + "</strong>");
      }
    }
  }

  columnIndexExist(currentProjectId: number, currentColumnIndex: number, newColumnIndex: number): boolean {
    return this._boardService.columnIndexExist(currentProjectId, currentColumnIndex, newColumnIndex);
  }

}
