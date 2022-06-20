import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { delay } from 'rxjs';
import { SEOType } from 'src/app/model/kanban.model';
import { SeoService } from 'src/app/services/seo.service';
import { DemoLoginDialogComponent } from './demo-login-dialog/demo-login-dialog.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  dialogWidth: string = '';

  constructor(
    private dialog: MatDialog, 
    private bpObserver: BreakpointObserver,
    private seoService: SeoService,
    ) { }

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
        }
      });
  }


  ngOnInit(): void {
    this.seoService.updateMetaInformationForPage(SEOType.Home);
  }

  demoLogin() {
    const dialogRef = this.dialog.open(DemoLoginDialogComponent, {
      width: this.dialogWidth,
      data: {}
    });
  }



}
