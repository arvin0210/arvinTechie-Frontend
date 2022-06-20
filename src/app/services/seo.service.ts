import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { SEOType } from '../model/kanban.model';

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private readonly appTitle = 'Project Management';
  private readonly appDescription = 'an Agile tool for project resource planning & kanban';

  constructor(private readonly metaTagService: Meta, private readonly titleService: Title) { }

  initDefaultMetaInformation() {
    this.titleService.setTitle(this.appTitle);
    this.metaTagService.addTags([
      { name: 'description', content: this.appDescription },
      { name: 'author', content: 'Arvin Pillaai' },
      { name: 'robots', content: 'index, follow' }, // telling the Search Engine bots - do index my website, do follow all the URL when you crawl my website
    ]);
  }

  updateMetaInformationForPage(type: SEOType, keyword?: string, others?: string[]) {
    //console.log("Type: " + type + ", keyword: " + keyword);
    switch (type) {
      case SEOType.Kanban:
        this.metaTagService.updateTag({ name: 'keywords', content: keyword + ' Kanban Board' });
        this.metaTagService.updateTag({ name: 'description', content: keyword + ' Kanban Board' });
        this.metaTagService.updateTag({ name: 'og:description', content: keyword + ' Kanban Board' });
        this.metaTagService.updateTag({ name: 'og:title', content: keyword + ' Kanban Board' });
        this.setTitle(keyword + ' Kanban Board');
        break;

      case SEOType.Project:
        this.metaTagService.updateTag({ name: 'keywords', content: 'Project Resource Pool' });
        this.metaTagService.updateTag({ name: 'description', content: 'Project Resource Pool' });
        this.metaTagService.updateTag({ name: 'og:description', content: 'Project Resource Pool' });
        this.metaTagService.updateTag({ name: 'og:title', content: 'Project Resource Pool' });
        this.setTitle('Project Resource Pool');
        break;

      case SEOType.Task:
        this.metaTagService.updateTag({ name: 'keywords', content: 'Task List' });
        this.metaTagService.updateTag({ name: 'description', content: 'Task List' });
        this.metaTagService.updateTag({ name: 'og:description', content: 'Task List' });
        this.metaTagService.updateTag({ name: 'og:title', content: 'Task List' });
        this.setTitle('Task List');
        break;

      case SEOType.Team:
        this.metaTagService.updateTag({ name: 'keywords', content: 'Team Mates' });
        this.metaTagService.updateTag({ name: 'description', content: 'Team Mates' });
        this.metaTagService.updateTag({ name: 'og:description', content: 'Team Mates' });
        this.metaTagService.updateTag({ name: 'og:title', content: 'Team Mates' });
        this.setTitle('Team Mates');
        break;

      case SEOType.Profile:
        this.metaTagService.updateTag({ name: 'keywords', content: 'Arvin Pillaai Profile' });
        this.metaTagService.updateTag({ name: 'description', content: 'Arvin Pillaai Profile' });
        this.metaTagService.updateTag({ name: 'og:description', content: 'Arvin Pillaai Profile' });
        this.metaTagService.updateTag({ name: 'og:title', content: 'Arvin Pillaai Profile' });
        this.setTitle('Arvin Pillaai Profile');
        break;

      case SEOType.Home:
      default:
        this.metaTagService.updateTag({ name: 'keywords', content: 'an agile tool for project resource planning & kanban' });
        this.metaTagService.updateTag({ name: 'description', content: this.appDescription });
        this.metaTagService.updateTag({ name: 'og:description', content: this.appDescription });
        this.metaTagService.updateTag({ name: 'og:title', content: this.appTitle });
        this.setTitle(this.appTitle);
        break;
    }
  }

  setTitle(title: string) {
    this.titleService.setTitle(title);
  }
}
