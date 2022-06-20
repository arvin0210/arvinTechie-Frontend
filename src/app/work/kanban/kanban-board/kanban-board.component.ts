import { BreakpointObserver } from '@angular/cdk/layout';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { BehaviorSubject, delay, filter, map } from 'rxjs';
import { Comment, Card, SwimLane, Dropper, DropperCDK, SEOType } from 'src/app/model/kanban.model';
import { TeamMate } from 'src/app/model/user-account.model';
import { AuthenticateService } from 'src/app/services/auth/authenticate.service';
import { DataService } from 'src/app/services/data.service';
import { ProjectService } from 'src/app/services/project.service';
import { TeamNetworkService } from 'src/app/services/team-network.service';
import { KColumnDialogComponent } from '../k-column-dialog/k-column-dialog.component';
import Swal from 'sweetalert2';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { KCardDialogComponent } from '../k-card-dialog/k-card-dialog.component';
import { KScheduleDialogComponent } from '../k-schedule-dialog/k-schedule-dialog.component';
import { SeoService } from 'src/app/services/seo.service';

@Component({
  selector: 'app-kanban-board',
  templateUrl: './kanban-board.component.html',
  styleUrls: ['./kanban-board.component.scss']
})
export class KanbanBoardComponent implements OnInit, AfterViewInit {

  projectId$ = new BehaviorSubject<number>(0);
  projectName$ = new BehaviorSubject<string>('');
  dialogWidth: string = '';
  teamMates !: TeamMate[];
  dropHandle = {} as Dropper;
  dropper: DropperCDK[];


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toast: HotToastService,
    private bpObserver: BreakpointObserver,
    private projectService: ProjectService,
    private authService: AuthenticateService,
    public dataService: DataService,
    private teamService: TeamNetworkService,
    private dialog: MatDialog,
    private seoService: SeoService,
  ) {
    this.dropper = new Array<DropperCDK>();
  }

  get isAdmin() {
    return this.authService.isAdmin;
  }

  get activeID() {
    return this.authService.getUserAccount().id;
  }

  ngOnInit(): void {
    this.teamService.getTeamMates(this.activeID).subscribe({
      next: (res) => { this.teamMates = res; }
    });
    this.route.params.subscribe({
      next: (params) => {
        this.projectId$.next(params['projectId']);
        this.getKanbanBaord(params['projectId']);
        
        this.projectService.getProject(this.activeID, params['projectId']).subscribe({
          next: (res) => {
            if (res.statusCode == 200) {
              this.projectName$.next(res.data.project?.name || '');
              this.seoService.updateMetaInformationForPage(SEOType.Kanban, res.data.project?.name);
            }
          }
        });
      },
      error: () => { this.toast.error('Error. ProjectID required for component to process.', { duration: 3000, dismissible: true }); }
    });
  }

  breakPointer() {
    this.bpObserver.observe(['(max-width: 800px)'])
      .pipe(delay(1))
      .subscribe({
        next: (response) => {
          // smaller screen
          if (response.matches) {
            this.dialogWidth = '100%';
          } else {
            // larger screen
            this.dialogWidth = '50%';
          }
        },
        error: () => { this.toast.error('An Error occured while executing bpObserver.', { duration: 5000, dismissible: true }); }
      });
  }

  drop(event: CdkDragDrop<Card[]>) {
    // console.log(event.previousContainer.id + " > " + event.container.id);

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);

      this.dropHandle.dropEvent = 'moveItemInArray';
      this.dropHandle.currentContainerId = Number(event.container.id);
      this.dropHandle.previousContainerId = 0;

      this.managerDroppers(this.dropHandle);

    }
    else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);

      this.dropHandle.dropEvent = 'transferArrayItem';
      this.dropHandle.currentContainerId = Number(event.container.id);
      this.dropHandle.previousContainerId = Number(event.previousContainer.id);

      this.managerDroppers(this.dropHandle);
    }
  }

  managerDroppers(d: Dropper) {
    var currentCont !: SwimLane;
    this.dataService.getBoard$().pipe(map(item => item.filter(item => item.id == d.currentContainerId))).subscribe(res => { currentCont = res[0]; });
    // console.log(currentCont);

    var prevCont !: SwimLane;
    this.dataService.getBoard$().pipe(map(item => item.filter(item => item.id == d.previousContainerId))).subscribe(res => { prevCont = res[0]; });
    // console.log(prevCont);

    this.dropper = new Array<DropperCDK>();

    switch (d.dropEvent) {
      // @ts-ignore
      case 'transferArrayItem':
        const tpholding = prevCont.cards.map(value => {
          return new DropperCDK(prevCont.id, value.id, prevCont.cards.indexOf(value));
        });
        this.dropper.push(...tpholding);

      case 'moveItemInArray':
        const cholding = currentCont.cards.map(value => {
          return new DropperCDK(currentCont.id, value.id, currentCont.cards.indexOf(value));
        });
        this.dropper.push(...cholding);
        break;

      default: break;
    }
    this.dataService.postUpdateCDKList(this.dropper).subscribe({
      next: (res) => {
        if (res.statusCode == 200)
          this.toast.success(res.message, { duration: 3000, dismissible: true });
        else
          this.toast.error(res.message, { duration: 3000, dismissible: true });
      }
    });
  }

  ngAfterViewInit() {
    this.breakPointer();
  }

  getKanbanBaord(projectId: number) {
    this.dataService.getAllSwimLanes(projectId);
  }

  onAddCard(swimLane: SwimLane) {
    const dialogRef = this.dialog.open(KCardDialogComponent, {
      width: this.dialogWidth,
      data: { swimLane: swimLane }
    });
    dialogRef.afterClosed().subscribe({
      next: (res) => {
        if (res === 'success') {
          this.getKanbanBaord(this.projectId$.value);
        }
      },
      error: () => { this.toast.error('An Error occured while afterClosed dialogRef onAddCard.', { duration: 3000, dismissible: true }); }
    });
  }


  onEditSwimLane(swimLane: SwimLane) {
    const dialogRef = this.dialog.open(KColumnDialogComponent, {
      width: this.dialogWidth,
      data: {
        projectId: this.projectId$.value,
        projectName: this.projectName$.value,
        teamMates: this.teamMates,
        swimLane: swimLane
      }
    });
    dialogRef.afterClosed().subscribe({
      next: (res) => {
        if (res === 'success') {
          this.getKanbanBaord(this.projectId$.value);
        }
      },
      error: () => { this.toast.error('An Error occured while afterClosed dialogRef onEditSwimLane.', { duration: 3000, dismissible: true }); }
    });
  }
  onDeleteSwimLane(swimLane: SwimLane) {
    Swal.fire({
      title: 'Do you want to delete Column: \n' + swimLane.userName,
      showCancelButton: true,
      confirmButtonText: 'Yes',
      confirmButtonColor: 'red',
    })
      .then((result) => {
        if (result.isConfirmed) {
          this.dataService.deleteSwimLane(swimLane, this.projectId$.value)
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
                  this.getKanbanBaord(this.projectId$.value);
                  Swal.fire({
                    icon: 'success',
                    title: 'Project Deleted!',
                    showConfirmButton: false,
                    html: res.message,
                    timer: 1500
                  });
                }
              },
              error: () => { this.toast.error('An Error occured while onDeleteSwimLane.', { duration: 5000, dismissible: true }); }
            });
        }
      });
  }

  // inside CDKDropList
  onDeleteCard(cardId: number, cardTitle: string) {
    Swal.fire({
      title: 'Do you want to delete Card: \n' + cardTitle,
      showCancelButton: true,
      confirmButtonText: 'Yes',
      confirmButtonColor: 'red',
    }).then((result) => {
      if (result.isConfirmed) {
        this.dataService.deleteCard(cardId, this.activeID).subscribe({
          next: (res) => {
            if (res.statusCode == 200) {
              Swal.fire({
                icon: 'success',
                title: 'Deleted!',
                showConfirmButton: false,
                html: 'Card ' + cardTitle,
                timer: 2000
              });
              this.getKanbanBaord(this.projectId$.value);
            }
          }
        });

      }
    });

  }

  // not used - insufficent use cases
  onEditCard(card: Card, swimLane: SwimLane) {
    const dialogRef = this.dialog.open(KCardDialogComponent, {
      width: this.dialogWidth,
      data: { swimLane: swimLane, card: card }
    });
    dialogRef.afterClosed().subscribe({
      next: (res) => {
        if (res === 'success') {
          this.getKanbanBaord(this.projectId$.value);
        }
      },
      error: () => { this.toast.error('An Error occured while afterClosed dialogRef onEditCard.', { duration: 3000, dismissible: true }); }
    });
  }

  onCardScheduleChange(swimLaneID: number, cardId: number, progress: number, cardTitle: string) {
    const dialogRef = this.dialog.open(KScheduleDialogComponent, {
      width: this.dialogWidth,
      data: { swimLaneID, cardId, progress, cardTitle }
    });
    dialogRef.afterClosed().subscribe({
      next: (res) => {
        if (res === 'success') {
          this.getKanbanBaord(this.projectId$.value);
        }
      },
      error: () => { this.toast.error('An Error occured while afterClosed dialogRef onCardScheduleChange.', { duration: 3000, dismissible: true }); }
    });
  }

  onAddComment(event: { id: number, text: string }) {
    this.dataService.postCommentToCard(event.id, event.text, this.activeID).subscribe({
      next: (res) => {
        if (res.statusCode == 200) {
          this.toast.success(res.message, { duration: 3000, dismissible: true });
          this.getKanbanBaord(this.projectId$.value);
        }
      }
    });
  }

  onDeleteComment(comment: Comment, columnId: number, itemId: number) {
    Swal.fire({
      title: 'Do you want to delete Comment: \n' + comment.text,
      showCancelButton: true,
      confirmButtonText: 'Yes',
      confirmButtonColor: 'red',
    }).then((result) => {
      if (result.isConfirmed) {
        this.dataService.deleteComment(comment.id, this.activeID).subscribe({
          next: (res) => {
            if (res.statusCode == 200) {
              Swal.fire({
                icon: 'success',
                title: 'Deleted!',
                showConfirmButton: false,
                html: 'Comment : ' + comment.text,
                timer: 2000
              });
              this.getKanbanBaord(this.projectId$.value);
            }
          }
        });

      }
    });
  }

}
