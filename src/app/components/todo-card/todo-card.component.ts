import { Component, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { ToDoSignalsService } from 'src/app/services/to-do-signals.service';
import { ToDoKeyLocalStorage } from 'src/app/models/enum/ToDoKeyLocalStorage';
import { ToDo } from 'src/app/models/model/Todo.model';

@Component({
  selector: 'app-todo-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
  ],
  templateUrl: './todo-card.component.html',
  styleUrls: [],
})
export class TodoCardComponent implements OnInit {
  constructor(private todoSignalService: ToDoSignalsService) {}

  private todosSignal = this.todoSignalService.todoState;
  public todoList = computed(() => this.todosSignal());

  private getTodosInLocalStorage(): void {
    const todosDatas = localStorage.getItem(
      ToDoKeyLocalStorage.TODO_LIST
    ) as string;
    todosDatas && this.todosSignal.set(JSON.parse(todosDatas));
  }

  private saveTodosInLocalStorage(): void {
    this.todoSignalService.saveTodosInLocalStorage();
  }

  public handleDoneTodo(todoId: number): void {
    if (todoId) {
      this.todosSignal.mutate((todos) => {
        const toDoSelected = todos.find((todo) => todo?.id === todoId) as ToDo;
        if (toDoSelected) {
          toDoSelected.done = true;
          toDoSelected.completedAt = new Date(); // Set the current date and time
        }
        this.saveTodosInLocalStorage();
      });
    }
  }
  public handleEditTodo(todo: ToDo): void {
    if (todo) {
      const updatedTitle = prompt('Edit Title', todo.title);
      const updatedDescription = prompt('Edit Description', todo.description);
  
      if (updatedTitle && updatedDescription) {
        this.todosSignal.mutate((todos) => {
          const toDoToEdit = todos.find((t) => t.id === todo.id);
          if (toDoToEdit) {
            toDoToEdit.title = updatedTitle;
            toDoToEdit.description = updatedDescription;
            this.saveTodosInLocalStorage(); // Save changes to local storage
          }
        });
      }
    }
  }
  public completedPercentage = computed(() => {
    const total = this.todoList().length;
    return total > 0 ? (this.completedCount() / total) * 100 : 0;
  });
  
  
  public inProgressPercentage = computed(() => {
    const total = this.todoList().length;
    return total > 0 ? (this.inProgressCount() / total) * 100 : 0;
  });
  
  

  public handleDeleteTodo(todo: ToDo): void {
    if (todo) {
      const index = this.todoList().indexOf(todo);

      if (index !== -1) {
        this.todosSignal.mutate((todos) => {
          todos.splice(index, 1);
          // salvar os dados atuais das todos
          this.saveTodosInLocalStorage();
        });
      }
    }
  }
  public completedCount = computed(() => 
    this.todoList().filter((todo) => todo.done).length
  );
  public inProgressCount = computed(() => 
    this.todoList().filter((todo) => !todo.done).length
  );
  

  public ngOnInit(): void {
    this.getTodosInLocalStorage();
    this.completedPercentage();
  }

  public getProgressColor(percentage: number): string {
    // Interpolate between red (0%) and green (100%)
    const red = Math.min(255, Math.floor((100 - percentage) * 2.55));
    const green = Math.min(255, Math.floor(percentage * 2.55));
    return `rgb(${red}, ${green}, 0)`;
  }

  public showPieChart = false; // Variable to track pie chart visibility

  // Method to toggle pie chart visibility
  public togglePieChart(): void {
    this.showPieChart = !this.showPieChart;
  }

  public pieChartBackground(): string {
    const completedPercentage = this.completedPercentage();
    const inProgressPercentage = this.inProgressPercentage();
    
    return `conic-gradient(
      green 0% ${completedPercentage}%,
      red ${completedPercentage}% ${completedPercentage + inProgressPercentage}%
    )`;
  }
}
