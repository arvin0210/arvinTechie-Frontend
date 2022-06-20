import { Component, OnInit } from '@angular/core';
import { SEOType } from 'src/app/model/kanban.model';
import { SeoService } from 'src/app/services/seo.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  constructor(private seoService: SeoService,) { }

  ngOnInit(): void {
    this.seoService.updateMetaInformationForPage(SEOType.Profile);
  }

}
