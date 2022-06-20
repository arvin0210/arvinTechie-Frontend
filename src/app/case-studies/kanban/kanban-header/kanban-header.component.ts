import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { KanbanBoardService } from 'src/app/services/kanban-board.service';
import { ColumnDialogBoxComponent } from '../column-dialog-box/column-dialog-box.component';
import { HotToastService } from '@ngneat/hot-toast';
import { Project } from 'src/app/model/kanban.model';

@Component({
  selector: 'app-kanban-header',
  templateUrl: './kanban-header.component.html',
  styleUrls: ['./kanban-header.component.scss']
})
export class KanbanHeaderComponent implements OnInit {

  @Input('projectId') projectId!: number;
  @Input('screenshot') screenshot!: boolean;
  @Input('ssDate') ssDate!: Date;
  @Output() emitDetailsClicked: EventEmitter<boolean> = new EventEmitter();
  details: boolean = false;
  project!: Project;
  constructor(
    private dialog: MatDialog,
    public _boardService: KanbanBoardService,
    private toastService: HotToastService,
  ) { }

  ngOnInit(): void {
    this.project = this._boardService.getProject();    
  }

  addColumn() {
    this.dialog.open(ColumnDialogBoxComponent, {
      width: "400px",
      data: { projectId: this.projectId }
    });
  }

  screenShot() {
    this._boardService.setScreenShot();
    this.toastService.success("Screenshot taken successfully");
  }

  openScreenShot() {
    this.details = !this.details;
    this.emitDetailsClicked.emit(this.details);
  }

}
