import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { delay } from 'rxjs';
import { DemoLoginDialogComponent } from './general/home/demo-login-dialog/demo-login-dialog.component';
import { AuthenticateService } from './services/auth/authenticate.service';
import { ProjectService } from './services/project.service';
import { SeoService } from './services/seo.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  dialogWidth: string = '';

  @ViewChild(MatSidenav) sidenav!: MatSidenav;

  constructor(
    private bpObserver: BreakpointObserver,
    private authService: AuthenticateService,
    public projectService: ProjectService,
    private dialog: MatDialog,
    private router: Router,
    private seoService: SeoService,
  ) { }

  ngOnInit(): void {
    if (this.isAuth)
      this.router.navigate(['/work-teamHome']);

    
  }

  ngAfterViewInit() {
    // can take any number of break-points
    // if any of the bp matches or changes state
    // all subscription of this method are notified
    this.bpObserver.observe(['(max-width: 800px)'])
      .pipe(delay(1))
      .subscribe((response) => {
        // smaller
        if (response.matches) {
          this.sidenav.mode = 'over';
          this.sidenav.close();
          this.dialogWidth = '100%';
        } else {
          // larger screen
          this.sidenav.mode = 'side';
          this.sidenav.open();
          this.dialogWidth = '50%';
        }
      });

      this.seoService.initDefaultMetaInformation(); 
  }

  btn_home_clicked() {
    if (this.sidenav.mode === 'over')
      this.sidenav.close();
  }

  get isAuth() {
    return this.authService.isAuthenticated();
  }

  get userAccount() {
    return this.authService.getUserAccount();
  }

  demoLogin() {
    const dialogRef = this.dialog.open(DemoLoginDialogComponent, {
      width: this.dialogWidth,
      data: {}
    });
  }


}
