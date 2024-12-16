import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TodoFormComponent } from '../todo-form/todo-form.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatDialogModule,
  ],
  templateUrl: './header.component.html',
  styleUrls: [],
})
export class HeaderComponent implements OnInit, OnDestroy {
  private dialogService = inject(MatDialog);

  public currentDate = new Date(); // Holds the current date
  public currentTime = this.formatTime(new Date()); // Holds the current time
  private timer: any; // Interval timer

  public handleOpenModal(): void {
    this.dialogService.open(TodoFormComponent, {
      width: '50vw',
      maxHeight: '80vh',
    });
  }

  ngOnInit(): void {
    // Update the current time every second
    this.timer = setInterval(() => {
      const now = new Date();
      this.currentDate = now;
      this.currentTime = this.formatTime(now);
    }, 1000);
  }

  ngOnDestroy(): void {
    // Clear the timer when the component is destroyed
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  private formatTime(date: Date): string {
    // Formats time as HH:mm:ss
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }
}
