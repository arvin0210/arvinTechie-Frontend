import { LiveAnnouncer } from '@angular/cdk/a11y';
import { BreakpointObserver } from '@angular/cdk/layout';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { HotToastService } from '@ngneat/hot-toast';
import { delay } from 'rxjs';
import { TaskService } from 'src/app/services/task.service';
import { TaskDialogComponent } from '../task-dialog/task-dialog.component';
import Swal from 'sweetalert2';
import { SeoService } from 'src/app/services/seo.service';
import { SEOType } from 'src/app/model/kanban.model';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit, AfterViewInit {

  dialogWidth: string = '';
  taskDataSource !: MatTableDataSource<any>;
  taskDisplayedColumns: string[] = ['description', 'targetDate', 'completed', 'action'];
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatTable) table !: MatTable<any>;

  constructor(
    public taskService: TaskService,
    private _liveAnnouncer: LiveAnnouncer,
    private bpObserver: BreakpointObserver,
    private dialog: MatDialog,
    private toast: HotToastService,
    private seoService: SeoService,
  ) {

  }

  breakPointer() {
    this.bpObserver.observe(['(max-width: 800px)'])
      .pipe(delay(1))
      .subscribe({
        next: (response) => {
          // smaller screen
          if (response.matches) {
            this.dialogWidth = '100%'

          } else {
            // larger screen
            this.dialogWidth = '50%';
          }
        },
        error: () => { this.toast.error('An Error occured while executing bpObserver.', { duration: 5000, dismissible: true }); }
      });
  }


  ngOnInit(): void {
    this.getAllTaskList();
    this.seoService.updateMetaInformationForPage(SEOType.Task);
  }

  ngAfterViewInit(): void {
    this.breakPointer();
  }

  getAllTaskList() {
    this.taskService.getAllTasks()
      .subscribe({
        next: (data) => {
          this.taskDataSource = new MatTableDataSource(data);
          this.taskDataSource.paginator = this.paginator;
          this.taskDataSource.sort = this.sort;
        },
        error: () => { this.toast.error('An Error occured while executing getAllTasks.', { duration: 3000, dismissible: true }); }
      });
  }

  addTask() {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: this.dialogWidth,
      data: {}
    });

    dialogRef.afterClosed().subscribe({
      next: (res) => {
        if (res === 'success') {
          this.getAllTaskList();
          this.table.renderRows();
        }
      },
      error: () => { this.toast.error('An Error occured while addTask afterClosed dialogRef.', { duration: 3000, dismissible: true }); }
    });
  }

  editTask(element: any) {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: this.dialogWidth,
      data: { element }
    });

    dialogRef.afterClosed().subscribe({
      next: (res) => {
        if (res === 'success') {
          this.getAllTaskList();
          this.table.renderRows();
        }
      },
      error: () => { this.toast.error('An Error occured while editTask afterClosed dialogRef.', { duration: 3000, dismissible: true }); }
    });
  }

  deleteTask(element: any) {
    Swal.fire({
      title: 'Do you want to delete: \n' + element.description,
      showCancelButton: true,
      confirmButtonText: 'Yes',
      confirmButtonColor: 'red',
    }).then((result) => {
      if (result.isConfirmed) {
        this.taskService.deleteTask(element.id)
          .subscribe({
            next: () => {
              this.getAllTaskList();
              this.table.renderRows();
              Swal.fire({
                icon: 'success',
                title: 'Deleted!',
                showConfirmButton: false,
                html: element.description,
                timer: 1500
              });
            },
            error: () => { this.toast.error('An Error occured while deleteTask.', { duration: 5000, dismissible: true }); }
          });
      }
    });
  }

  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

}


