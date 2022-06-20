import { BreakpointObserver } from '@angular/cdk/layout';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { HotToastService } from '@ngneat/hot-toast';
import { delay } from 'rxjs';
import { Project, SEOType } from 'src/app/model/kanban.model';
import { AuthenticateService } from 'src/app/services/auth/authenticate.service';
import { ProjectService } from 'src/app/services/project.service';
import { ProjectDialogComponent } from '../project-dialog/project-dialog.component';
import Swal from 'sweetalert2';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { SeoService } from 'src/app/services/seo.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ProjectComponent implements OnInit, AfterViewInit {

  dialogWidth: string = '';
  projectCount: number = 0;

  displayedColumns: string[] = ['name', 'resource', 'description', 'startDate', 'action'];
  displayedMobileColumns: string[] = ['name', 'resource'];
  dataSource: MatTableDataSource<Project>;
  selection  = new Set<Project>();
  expandedElement !: Project;
  fullscreen: boolean = true;

  _project !: Project;

  @ViewChild(MatSort) sort !: MatSort;
  @ViewChild(MatPaginator) paginator !: MatPaginator;
  @ViewChild(MatTable) table !: MatTable<Project>;


  constructor(
    private authService: AuthenticateService,
    private toast: HotToastService,
    private dialog: MatDialog,
    private bpObserver: BreakpointObserver,
    private projectService: ProjectService,
    private seoService: SeoService,
  ) {
    this.dataSource = new MatTableDataSource<Project>();
  }

  get isAdmin() {
    return this.authService.isAdmin;
  }

  get activeID() {
    return this.authService.getUserAccount().id;
  }

  breakPointer() {
    this.bpObserver.observe(['(max-width: 800px)'])
      .pipe(delay(1))
      .subscribe({
        next: (response) => {
          // smaller screen
          if (response.matches) {
            this.dialogWidth = '100%';
            this.fullscreen = false;
          } else {
            // larger screen
            this.dialogWidth = '50%';
            this.fullscreen = true;
          }
        },
        error: () => { this.toast.error('An Error occured while executing bpObserver.', { duration: 5000, dismissible: true }); }
      });
  }

  ngOnInit(): void {
    this.getProjects();
    this.seoService.updateMetaInformationForPage(SEOType.Project);
  }

  getProjects() {
    this.projectService.getAllProjects(this.activeID)
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
          this.projectCount = res.data.projects?.length || 0;
          this.dataSource = new MatTableDataSource(res.data.projects);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.projectService.populateProjects(res.data.projects);
        }
      },
      error: () => { this.toast.error('An Error occured while executing getProjects.', { duration: 3000, dismissible: true }); }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.breakPointer();
  }

  //#region Projects
  detailProject(element: Project) {
    this.expandedElement = {} as Project;
    this.selection.clear();
    this.selection.add(element);
    this._project = element;
    console.log(this._project);    
  }  
  addProject() {
    const dialogRef = this.dialog.open(ProjectDialogComponent, {
      width: this.dialogWidth,
      data: { }
    });
    dialogRef.afterClosed().subscribe({
      next: (res) => {
        if (res === 'success') {
          this.getProjects();
          this.table.renderRows();
        }
      },
      error: () => { this.toast.error('An Error occured while addTeamMate afterClosed dialogRef.', { duration: 3000, dismissible: true }); }
    });
  }
  editProject(element: Project) {
    const dialogRef = this.dialog.open(ProjectDialogComponent, {
      width: this.dialogWidth,
      data: { project: element }
    });
    dialogRef.afterClosed().subscribe({
      next: (res) => {
        if (res === 'success') {
          this.getProjects();
          this.table.renderRows();
        }
      },
      error: () => { this.toast.error('An Error occured while addTeamMate afterClosed dialogRef.', { duration: 3000, dismissible: true }); }
    });
  }
  deleteProject(element: Project) {
    Swal.fire({
      title: 'Do you want to delete Project: \n' + element.name,
      showCancelButton: true,
      confirmButtonText: 'Yes',
      confirmButtonColor: 'red',
    }).then((result) => {
      if (result.isConfirmed) {
        this.projectService.deleteProject(element)
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
                this.getProjects();
                this.table.renderRows();
                Swal.fire({
                  icon: 'success',
                  title: 'Project Deleted!',
                  showConfirmButton: false,
                  html: element.description,
                  timer: 1500
                });
              }              
            },
            error: () => { this.toast.error('An Error occured while deleteProject.', { duration: 5000, dismissible: true }); }
          });
      }
    });
  }
  //#endregion

}
