import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { HotToastService } from '@ngneat/hot-toast';
import { AuthenticateService } from 'src/app/services/auth/authenticate.service';
import { DtoMember, RoleDetail, TeamMate } from 'src/app/model/user-account.model';
import { TeamNetworkService } from 'src/app/services/team-network.service';
import { MatDialog } from '@angular/material/dialog';
import { TeamMateDialogComponent } from '../team-mate-dialog/team-mate-dialog.component';
import { BreakpointObserver } from '@angular/cdk/layout';
import { delay } from 'rxjs';
import { animate, state, style, transition, trigger } from '@angular/animations';
import Swal from 'sweetalert2';
import { ProjectService } from 'src/app/services/project.service';
import { SeoService } from 'src/app/services/seo.service';
import { SEOType } from 'src/app/model/kanban.model';

@Component({
  selector: 'app-team-home',
  templateUrl: './team-home.component.html',
  styleUrls: ['./team-home.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class TeamHomeComponent implements OnInit, AfterViewInit {

  teamCount: number = 0;
  fullLengthDisplayedColumns: string[] = ['roleName', 'firstName', 'lastName', 'email', 'action'];
  mobileDisplayedColumns: string[] = ['firstName', 'lastName'];
  dataSource: MatTableDataSource<TeamMate>;
  userId = this.authService.getUserAccount().id;
  dialogWidth: string = '';
  fullscreen: boolean = true;

  expandedElement !: TeamMate;
  memberDetails !: DtoMember;
  roles !: RoleDetail[];

  @ViewChild(MatSort) sort !: MatSort;
  @ViewChild(MatPaginator) paginator !: MatPaginator;
  @ViewChild(MatTable) table !: MatTable<TeamMate>;

  constructor(
    private authService: AuthenticateService,
    private teamService: TeamNetworkService,
    private toast: HotToastService,
    private dialog: MatDialog,
    private bpObserver: BreakpointObserver,
    private projectService: ProjectService,
    private seoService: SeoService,
  ) {
    this.dataSource = new MatTableDataSource<TeamMate>();
  }

  get isAdmin() {
    return this.authService.isAdmin;
  }

  breakPointer() {
    this.bpObserver.observe(['(max-width: 800px)'])
      .pipe(delay(1))
      .subscribe({
        next: (response) => {
          // smaller screen
          if (response.matches) {
            this.dialogWidth = '100%'
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
    this.getTeamMates();
    this.getRoles();
    this.getProjects();
    this.seoService.updateMetaInformationForPage(SEOType.Team);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.breakPointer();
  }

  getTeamMates() {

    this.teamService.getTeamMates(this.userId)
      .subscribe({
        next: (data) => {
          this.teamCount = data.length;
          this.dataSource = new MatTableDataSource(data);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error: () => { this.toast.error('An Error occured while executing getTeamMates.', { duration: 3000, dismissible: true }); }
      });
  }

  getRoles() {
    this.teamService.getRoles()
    .subscribe({
      next:(res) => { this.roles = res; },
      error:() => { this.toast.error('An Error occured while retrieving roles.', { duration: 3000, dismissible: true }); }
    });
  }

  getProjects() {
    this.projectService.getAllProjects(this.userId)
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
          this.projectService.populateProjects(res.data.projects);
        }
      },
      error: () => { this.toast.error('An Error occured while executing getProjects.', { duration: 3000, dismissible: true }); }
    });
  }

  //#region TeamMates
  addTeamMate() {
    const dialogRef = this.dialog.open(TeamMateDialogComponent, {
      width: this.dialogWidth,
      data: { roles: this.roles }
    });
    dialogRef.afterClosed().subscribe({
      next: (res) => {
        if (res === 'success') {
          this.getTeamMates();
          this.table.renderRows();
        }
      },
      error: () => { this.toast.error('An Error occured while addTeamMate afterClosed dialogRef.', { duration: 3000, dismissible: true }); }
    });
  }

  editTeamMate(element: any) {
    this.teamService.getMemberDetails(element.id, element.email)
      .subscribe({
        next: (res) => { this.memberDetails = res; },
        complete: () => { this.TeamMateDialog(); },
        error: () => { this.toast.error('An Error occured while retrieving getMemberDetails.', { duration: 3000, dismissible: true }); }
      });      
  }

  TeamMateDialog() {
    const dialogRef = this.dialog.open(TeamMateDialogComponent, {
      width: this.dialogWidth,
      data: { roles: this.roles, member: this.memberDetails }
    });
    dialogRef.afterClosed().subscribe({
      next: (res) => {
        if (res === 'success') {
          this.getTeamMates();
          this.table.renderRows();
        }
       },
      error: () => { this.toast.error('An Error occured while TeamMateDialog afterClosed dialogRef.', { duration: 3000, dismissible: true }); }
    });
  }

  deleteTeamMate(element: any) {
    Swal.fire({
      title: 'Do you want to delete Member: \n' + element.firstName + ", " + element.lastName,
      showCancelButton: true,
      confirmButtonText: 'Yes',
      confirmButtonColor: 'red',
    }).then((result) => {
      if (result.isConfirmed) {
        this.teamService.deleteMember(element.id)
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
                this.getTeamMates();
                this.table.renderRows();
                Swal.fire({
                  icon: 'success',
                  title: 'Member Deleted!',
                  showConfirmButton: false,
                  html: element.description,
                  timer: 1500
                });
              }              
            },
            error: () => { this.toast.error('An Error occured while deleteTask.', { duration: 5000, dismissible: true }); }
          });
      }
    });
  }
  //#endregion

  
}
