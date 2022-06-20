import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Card, SwimLane, Comment, Project } from 'src/app/model/kanban.model';
import { KanbanBoardService } from 'src/app/services/kanban-board.service';
import { CardDialogBoxComponent } from '../card-dialog-box/card-dialog-box.component';
import Swal from 'sweetalert2';
import { ColumnDialogBoxComponent } from '../column-dialog-box/column-dialog-box.component';
import { ScheduleDialogBoxComponent } from '../schedule-dialog-box/schedule-dialog-box.component';
import { ActivatedRoute } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  public projectId: number = 0;
  public kanbanStatus: boolean = true;
  public screenDate!: Date;
  public ssOpen: boolean = false;
  constructor(
    public _boardService: KanbanBoardService, 
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private toast: HotToastService,
    ) { }

  ngOnInit(): void {
    this.route.params.subscribe({
      next:(params) => { 
        this.projectId = params['projectId'];
      },
      error:() => { this.toast.error('Error. ProjectID required for component to process.', { duration: 3000, dismissible: true });  }
    });
  }

  detailsClicked(d: boolean) {
    this.ssOpen = d;
  }

  /*
  * (-1) passed when screenshot selected, then deleted
  * (above 0) passed when behaviour select screnshot
  */
  clickScreenShot(activeId: number) {
    if (activeId > 0) {
      this._boardService.screenReset_NonSelection(activeId);
      this.kanbanStatus = !this._boardService.screen_GetStatus(activeId);
      if (!this.kanbanStatus) {
        this.screenDate = this._boardService.screen_GetDate(activeId);
      }
    } else {
      this.resetScreenshot();
    }
    
  }

  resetScreenshot() {
    this._boardService.screenReset_All();
    this.kanbanStatus = true;
  }

  onColorChange(color: string, columnId: number) {
    this._boardService.changeColumnColor(color, columnId)
  }

  onEditColumn(column: SwimLane) {
    this.dialog.open(ColumnDialogBoxComponent, {
      width: "400px",
      data: { projectId: column.projectId, columnTitle: column.userName, columnRoleName: column.roleName, columnIndex: column.sortIndex, columnId: column.id }
    });
  }

  onDeleteColumn(columnId: number, columnTitle: string) {
    Swal.fire({
      title: 'Do you want to delete Column: \n' + columnTitle,
      showCancelButton: true,
      confirmButtonText: 'Yes',
      confirmButtonColor: 'red',
    }).then((result) => {
      if (result.isConfirmed) {
        this._boardService.deleteColumn(columnId);
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          showConfirmButton: false,
          html: 'Column ' + columnTitle,
          timer: 2000
        });
      } 
    });
  }

  onAddCard(text: string, columnId: number) {
    this.dialog.open(CardDialogBoxComponent, {
      width: "400px",
      data: { columnId, text }
    });
  }

  onDeleteCard(cardId: number, cardTitle: string, columnId: number) {    
    Swal.fire({
      title: 'Do you want to delete Card: \n' + cardTitle,
      showCancelButton: true,
      confirmButtonText: 'Yes',
      confirmButtonColor: 'red',
    }).then((result) => {
      if (result.isConfirmed) {
        this._boardService.deleteCard(cardId, columnId);
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          showConfirmButton: false,
          html: 'Card ' + cardTitle,
          timer: 2000
        });
      } 
    });
  }

  onCardScheduleChange(columnId: number, cardId: number, progress: number) {
    this.dialog.open(ScheduleDialogBoxComponent, {
      width: "400px",
      data: { columnId, cardId, progress }
    });
  }

  onAddComment(event: { id: number, text: string }, columnId: number) {
    this._boardService.addComment(columnId, event.id, event.text, true);
  }

  onDeleteComment(comment: Comment, columnId: number, itemId: number) {
    this._boardService.deleteComment(columnId, itemId, comment.id);
  }

  drop(event: CdkDragDrop<Card[]>) {

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } 
    else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

}
