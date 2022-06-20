import { AfterViewInit, Component, DoCheck, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { SwimLane, Project, SEOType } from 'src/app/model/kanban.model';
import { TeamMate } from 'src/app/model/user-account.model';
import { AuthenticateService } from 'src/app/services/auth/authenticate.service';
import { ProjectService } from 'src/app/services/project.service';
import { TeamNetworkService } from 'src/app/services/team-network.service';
import { KColumnDialogComponent } from '../k-column-dialog/k-column-dialog.component';

@Component({
  selector: 'app-k-header',
  templateUrl: './k-header.component.html',
  styleUrls: ['./k-header.component.scss']
})
export class KHeaderComponent implements OnInit {

  @Input('projectId') projectId$ = new BehaviorSubject<number>(0);
  @Input('projectName') projectName$ = new BehaviorSubject<string>('');
  @Input('dialogWidth') dialogWidth !: string;

  projectId: number = 0;
  projectName: string = '';
  teamMates !: TeamMate[];

  constructor(
    public projectService: ProjectService,
    private authService: AuthenticateService,
    private dialog: MatDialog,
    private teamService: TeamNetworkService,    
  ) { }

  get activeID() {
    return this.authService.getUserAccount().id;
  }

  get isAdmin() {
    return this.authService.isAdmin;
  }

  ngOnInit(): void {
    if (this.isAdmin)
      this.teamService.getTeamMates(this.activeID).subscribe({
        next: (res) => { this.teamMates = res; }
      });    
  }

  addSwimLane() {
    this.projectId = this.projectId$.value;
    this.projectName = this.projectName$.value;
    this.dialog.open(KColumnDialogComponent, {
      width: this.dialogWidth,
      data: {
        projectId: this.projectId,
        projectName: this.projectName,
        teamMates: this.teamMates,
      }
    });
  }
}
