import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { screenShot } from 'src/app/model/kanban.model';
import { KanbanBoardService } from 'src/app/services/kanban-board.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-screenshot-item',
  templateUrl: './screenshot-item.component.html',
  styleUrls: ['./screenshot-item.component.scss']
})
export class ScreenshotItemComponent implements OnInit {

  @Input() item!: screenShot;
  @Output() emitScreenshot: EventEmitter<number> = new EventEmitter();
  constructor(public _boardService: KanbanBoardService, public datepipe: DatePipe) { }

  ngOnInit(): void {
    
  }

  onClicked(screenId: number) {    
    this.item.active = !this.item.active;
    this.emitScreenshot.emit(screenId);
  }

  onDelete(i: screenShot) {

    if (i.active) {
      this.emitScreenshot.emit(-1);
    }

    Swal.fire({
      title: 'Do you want to delete Screenshot: \n' + this.datepipe.transform(i.date, 'MMM dd, yyyy : hh a'),
      showCancelButton: true,
      confirmButtonText: 'Yes',
      confirmButtonColor: 'red',
    }).then((result) => {
      if (result.isConfirmed) {
        this._boardService.deleteScreenshot(i.id);
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          showConfirmButton: false,
          html: 'Screenshot ' + this.datepipe.transform(i.date, 'MMM dd, yyyy : hh a'),
          timer: 2000
        });
      } 
    });

  }
}
