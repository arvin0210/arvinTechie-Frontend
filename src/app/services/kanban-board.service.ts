import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Card, SwimLane, Comment, Project, screenShot } from '../model/kanban.model';

@Injectable({
  providedIn: 'root'
})
export class KanbanBoardService {

  constructor() { }

  private initBoard: SwimLane[] =
    [
      {

        projectId: 1,
        id: 1,
        userId: 1,
        userName: "Harry, Marshall",
        roleName: 'Project Lead',
        color: "#009886",
        sortIndex: 1,
        cards: [
          {
            id: 1,
            swimLaneId: 0,
            cardIndex: 0,
            text: "Requirement Review",
            progress: 50,
            comments: [
              {
                id: 2,
                text: "50% - Stakeholders Approved phase 2 changes",
                commentDate: new Date('05-10-2022'),
                canDelete: false
              },
              {
                id: 1,
                text: "Initial Draft completed",
                commentDate: new Date('2022-04-07 13:23:54.7040000'),
                canDelete: true,
                userId: 2,
                userName: 'Arvin, Pillaai',
              }
            ]
          }
        ]
      },
      {

        projectId: 1,
        id: 2,
        userId: 2,
        userName: "Arvin, Pillaai",
        roleName: 'FullStack Developer',
        color: "#e92c64",
        sortIndex: 2,
        cards: [
          {
            id: 1647606466176,
            swimLaneId: 0,
            cardIndex: 0,
            text: "Frontend Infrastructure",
            progress: 20,
            comments: [
              {
                id: 2,
                text: "20% - Main Navigation completed",
                commentDate: new Date('03-24-2022'),
                canDelete: false
              }
            ]
          }
        ]
      },
      {

        projectId: 1,
        id: 4,
        userId: 3,
        userName: "Vaishak",
        roleName: 'BackEnd Developer',
        color: "#208eed",
        sortIndex: 3,
        cards: [
          {
            id: 1647606819711,
            swimLaneId: 0,
            cardIndex: 0,
            text: ".Net Core API Scope",
            progress: 0,
            comments: []
          },
          {
            id: 1647606523540,
            swimLaneId: 0,
            cardIndex: 0,
            text: "Backend Infrastructure",
            progress: 50,
            comments: []
          }
        ]
      },
      {

        projectId: 1,
        id: 3,
        userId: 4,
        userName: "Shalin",
        roleName: 'FrontEnd Developer',
        color: "#b36619",
        sortIndex: 4,
        cards: [
          {
            id: 4,
            swimLaneId: 0,
            cardIndex: 0,
            text: "User Authentication",
            progress: 40,
            comments: [
              {
                id: 5,
                text: "Using Java",
                commentDate: new Date('05-06-2022'),
                canDelete: true
              }
            ]
          }
        ]
      },
      {

        projectId: 1,
        id: 5,
        userId: 0,
        userName: "Completed",
        roleName: 'Bin',
        color: "#808080",
        sortIndex: 9999,
        cards: [
          {
            id: 1647606640520,
            swimLaneId: 0,
            cardIndex: 0,
            text: "Project Scope & Expectations",
            progress: 100,
            comments: [
              {
                id: 1647606673692,
                text: "Project scope and expectations discussed with developers",
                commentDate: new Date('03-14-2022'),
                canDelete: true
              }
            ]
          },
          {
            id: 1647606784080,
            swimLaneId: 0,
            cardIndex: 0,
            text: "Angular 13 Template Development",
            progress: 100,
            comments: [
              {
                id: 1647607402860,
                text: "framework finalized",
                commentDate: new Date('02-24-2022'),
                canDelete: true,
                userId: 2,
                userName: 'Arvin, Pillaai',
              },
              {
                id: 1647607327765,
                text: "main framework completed",
                commentDate: new Date('02-12-2022'),
                canDelete: true
              }
            ]
          }
        ]
      }
    ];

  private project: Project = {
    id: 1,
    leaderId: 1,
    name: 'Olympus',
    description: 'Internal application that monitors Risk Matrix between high stake entities.',
    startDate: new Date('2022-03-10 10:30:54.7040000'),
  };
  private board: SwimLane[] = this.initBoard;
  private board$ = new BehaviorSubject<SwimLane[]>(this.initBoard.sort((a, b) => (a.sortIndex > b.sortIndex) ? 1 : -1));

  private initScreen: screenShot[] = [
    { id: 1, date: new Date('03-04-2022 17:00'), canDelete: false, active: false }, // System Triggered
    { id: 2, date: new Date('03-11-2022 17:00'), canDelete: false, active: false }, // System Triggered
    { id: 3, date: new Date('03-18-2022 17:00'), canDelete: false, active: false }, // System Triggered
    { id: 4, date: new Date('03-25-2022 17:00'), canDelete: false, active: false }, // System Triggered
  ];
  private screen: screenShot[] = this.initScreen;
  private screen$ = new BehaviorSubject<screenShot[]>(this.screen);

  getProject() {
    return this.project;
  }

  getScreen$() {
    return this.screen$;
  }

  screenReset_NonSelection(activeId: number) {
    this.screen = this.screen.map((s: screenShot) => {
      if (s.id != activeId) {
        s.active = false;
      }
      return s;
    });
    this.screen$.next([...this.screen]);
  }

  screenReset_All() {
    this.screen = this.screen.map((s: screenShot) => {
      s.active = false;
      return s;
    });
    this.screen$.next([...this.screen]);
  }

  screen_GetStatus(id: number): boolean {
    return this.screen.filter((a: screenShot) => a.id === id)[0].active;
  }

  screen_GetDate(id: number): Date {
    return this.screen.filter((a: screenShot) => a.id === id)[0].date;
  }

  // User Triggered
  setScreenShot() {
    var s: screenShot = { id: this.screen.length + 1, date: new Date(), canDelete: true, active: false };
    this.screen = [...this.screen, s];
    this.screen$.next([...this.screen]);
  }

  deleteScreenshot(id: number) {
    this.screen = this.screen.filter((a: screenShot) => a.id != id);
    this.screen$.next([...this.screen]);
  }

  getBoardLength() {
    return this.board.length;
  }

  getColumn_Title(columnId: number) {
    const sColumn = this.board.filter((column: SwimLane) => column.id == columnId)[0];
    return sColumn.userName;
  }

  getCard_Title(columnId: number, cardId: number) {
    const sColumn = this.board.filter((column: SwimLane) => column.id == columnId)[0];
    const sCard = sColumn.cards.filter((card: Card) => card.id == cardId)[0];
    return sCard.text;
  }

  getBoard$() {
    return this.board$;
  }

  changeColumnColor(color: string, columnId: number) {
    this.board = this.board.map((column: SwimLane) => {
      if (column.id === columnId) {
        column.color = color;
      }
      return column;
    });
    this.sortBoard();
  }

  // Column related
  addColumn(title: string, colRole: string, colIndex: number, colProjectId: number) {
    const newColumn: SwimLane = {
      id: this.board.length + 1,
      projectId: colProjectId,
      userId: 1,
      userName: title,
      roleName: colRole,
      color: '#009886',
      sortIndex: colIndex,
      cards: [],
    };

    this.board = [...this.board, newColumn];
    this.sortBoard();
  }

  editColumn(columnId: number, title: string, colRole: string, newColumnIndex: number) {
    var editColumn = this.board.filter((column: SwimLane) => column.id === columnId)[0];
    editColumn.userName = title;
    editColumn.roleName = colRole;
    editColumn.sortIndex = newColumnIndex;
    this.sortBoard();
  }

  columnIndexExist(currentProjectId: number, currentColumnIndex: number, newColumnIndex: number): boolean {
    if (currentColumnIndex == newColumnIndex)
      return false;
    const column = this.board.filter((column: SwimLane) => column.sortIndex == newColumnIndex && column.projectId == currentProjectId);
    if (column.length > 0) {
      return true;
    }
    else {
      return false;
    }
  }

  // Card Related
  addCard(text: string, columnId: number) {
    const newCard: Card = {
      id: Date.now(),
      cardIndex: 0,
      swimLaneId: 0,
      text,
      progress: 0,
      comments: [],
    };

    this.board = this.board.map((column: SwimLane) => {
      if (column.id === columnId) {
        column.cards = [newCard, ...column.cards];
      }
      return column;
    });

    this.sortBoard();
  }

  deleteColumn(columnId: number) {
    this.board = this.board.filter((column: SwimLane) => column.id !== columnId);
    this.sortBoard();
  }

  deleteCard(cardId: number, columnId: number) {
    this.board = this.board.map((column: SwimLane) => {
      if (column.id === columnId) {
        column.cards = column.cards.filter((card: Card) => card.id !== cardId);
      }
      return column;
    });

    this.sortBoard();
  }

  changeCardProgress(columnId: number, cardId: number, newProgress: number, progressComment: string) {
    // update Progress
    var editCard = this.board.filter((column: SwimLane) => column.id === columnId)[0].cards.filter((card: Card) => card.id === cardId)[0];
    editCard.progress = newProgress;

    // insert new comment
    this.addComment(columnId, cardId, newProgress + '% - ' + progressComment, false);
  }

  // Comment Related
  addComment(columnId: number, cardId: number, text: string, canDelete: boolean) {
    this.board = this.board.map((column: SwimLane) => {
      if (column.id === columnId) {
        const list = column.cards.map((card: Card) => {
          if (card.id === cardId) {
            const newComment = {
              id: Date.now(),
              text,
              commentDate: new Date(),
              canDelete: canDelete
            };
            card.comments = [newComment, ...card.comments];
          }
          return card;
        });

        column.cards = list;
      }
      return column;
    });

    this.sortBoard();
  }

  deleteComment(columnId: number, itemId: number, commentId: number) {
    this.board = this.board.map((column: SwimLane) => {
      if (column.id === columnId) {
        const list = column.cards.map((item) => {
          if (item.id === itemId) {
            item.comments = item.comments.filter((comment: Comment) => {
              return comment.id !== commentId
            })
          }
          return item
        })
        column.cards = list
      }
      return column
    })
    this.sortBoard();
  }

  sortBoard() {
    this.board$.next([...this.board].sort((a, b) => (a.sortIndex > b.sortIndex) ? 1 : -1));
  }
}
