export interface Project {
  id: number;
  leaderId: number;
  name: string;
  description: string;
  startDate: Date;
  resource ?: number;  
}

export interface SwimLane {
  id: number;
  projectId: number;
  userId: number;
  userName: string;
  roleName: string;
  color: string;
  sortIndex: number;
  cards: Card[];
}

export interface Card {
  id: number;
  swimLaneId: number;
  cardIndex: number;
  text: string;
  progress: number;
  comments: Comment[];
}

export interface Comment {
  id: number;
  text: string;
  commentDate: Date;
  canDelete: boolean;
  userId?: number;
  userName?: string;
}

export interface screenShot {
  id: number;
  date: Date;
  canDelete: boolean;
  active: boolean;
}

export interface Dropper {
  dropEvent: string;
  previousContainerId : number;
  currentContainerId : number;
}

export class DropperCDK {
  swimLaneId: number;
  cardId: number;
  cardIndex: number;

  constructor(swimLaneId: number, cardId: number, cardIndex: number) {
    this.swimLaneId = swimLaneId;
    this.cardId = cardId;
    this.cardIndex = cardIndex;
  }
  
}

export enum SEOType {
  Kanban = 'Kanban',
  Project = 'Project',
  Task = 'Task-List',
  Team = 'Team-Mates',
  Home = 'Home',
  Profile = 'Profile',
}
