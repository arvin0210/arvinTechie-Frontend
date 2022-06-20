import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { TodoListService } from 'src/app/services/todo-list.service';
import { DialogBoxComponent } from './dialog-box/dialog-box.component';
import { TaskList } from '../../model/task.model';
import Swal from 'sweetalert2';
import { BreakpointObserver } from '@angular/cdk/layout';
import { delay, map } from 'rxjs';
import { AuthenticateService } from 'src/app/services/auth/authenticate.service';

@Component({
  selector: 'app-todo-table',
  templateUrl: './todo-table.component.html',
  styleUrls: ['./todo-table.component.scss']
})
export class TodoTableComponent implements OnInit, AfterViewInit {

  dialogWidth: string = '';
  todos: TaskList[] = [];
  todoDataSource = new MatTableDataSource(this.todos);
  todoDisplayedColumns: string[] = ['Description', 'targetDate', 'done', 'action'];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatTable) table !: MatTable<any>;

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private dialog: MatDialog,
    private todoService: TodoListService,
    private bpObserver: BreakpointObserver,
    private authService: AuthenticateService,

  ) {

  }

  ngOnInit(): void {
    this.todoDataSource.data = this.getTodoList();
  }

  get isAuth() {
    return this.authService.isAuthenticated();
  }

  getTodoList(): TaskList[] {
    return this.todoService.getAllList();
  }

  ngAfterViewInit(): void {
    this.todoDataSource.sort = this.sort;
    this.todoDataSource.paginator = this.paginator;

    this.bpObserver.observe(['(max-width: 800px)'])
      .pipe(delay(1))
      .subscribe((response) => {
        // smaller screen
        if (response.matches) {
          this.dialogWidth = '100%'

        } else {
          // larger screen
          this.dialogWidth = '50%';
        }
      });
  }

  addTodo() {
    const dialogRef = this.dialog.open(DialogBoxComponent, {
      width: this.dialogWidth,
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.todoDataSource.data = this.getTodoList();
      this.table.renderRows();
    });
  }

  editTodo(id: number) {
    const todo = this.getTodoList().find(a => a.id === id);
    const dialogRef = this.dialog.open(DialogBoxComponent, {
      width: this.dialogWidth,
      data: { todo }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.todoDataSource.data = this.getTodoList();
      this.table.renderRows();
    });
  }

  deleteTodo(id: number) {
    const todo = this.getTodoList().find(a => a.id === id);
    Swal.fire({
      title: 'Do you want to delete: \n' + todo?.description,
      showCancelButton: true,
      confirmButtonText: 'Yes',
      confirmButtonColor: 'red',
    }).then((result) => {
      if (result.isConfirmed) {
        this.todoService.deleteList(id);
        this.todoDataSource.data = this.getTodoList();
        this.table.renderRows();
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          showConfirmButton: false,
          html: todo?.description,
          timer: 1500
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
