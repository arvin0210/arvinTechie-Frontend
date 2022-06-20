import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { TaskList } from '../model/task.model';
import { AuthenticateService } from './auth/authenticate.service';

@Injectable({
  providedIn: 'root'
})
export class TodoListService {

  constructor() { }

  private todoList: TaskList[] = [
    { id: 1, description: 'Learn simple Yoga', targetDate: this.addDays(6), completed: true, user_account_id: 1 },
    { id: 2, description: 'Pickup Oil Painting', targetDate: new Date('2022-06-30'), completed: false, user_account_id: 1 },
    { id: 3, description: 'Do a 5km Walk', targetDate: new Date('2022-05-10'), completed: false, user_account_id: 1 },
  ];

  // main call to get list
  getAllList(): TaskList[] {
    this.todoList.forEach(item => {
      item = this.isTargetDueCheck(item);
    });

    return this.todoList;
  }

  addList(todo: TaskList) {
    todo.id = this.todoList.length + 1;
    todo.completed = false;
    this.todoList.push(todo);
  }

  editList(todo: TaskList) {
    const index = this.todoList.findIndex(c => c.id === todo.id);
    this.todoList[index] = todo;
  }

  deleteList(id: number) {
    const todo = this.todoList.findIndex(c => c.id === id);
    this.todoList.splice(todo, 1);
  }



  isTargetDueCheck(todo: TaskList): TaskList {
    var date = new Date();
    date.setDate(date.getDate() + 7);
    if (todo.targetDate <= date && !todo.completed) {
      todo.highlighted = true;
    }
    else {
      todo.highlighted = false;
    }
    return todo;
  }

  addDays(days: number): Date {
    var futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);
    return futureDate;
  }

}
