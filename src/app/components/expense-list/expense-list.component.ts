import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Expense } from '../../models/expense.model';

@Component({
  selector: 'app-expense-list',
  template: `
    <div class="expense-list">
      <div class="header">
        <h2>Recent Expenses</h2>
        <button (click)="onAddExpense()">Add Expense</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Title</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let expense of expenses">
            <td>{{expense.date | date}}</td>
            <td>{{expense.title}}</td>
            <td>{{expense.category}}</td>
            <td>{{expense.amount | currency}}</td>
            <td>
              <button (click)="onEdit(expense.id)">Edit</button>
              <button (click)="onDelete(expense.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .expense-list {
      background: white;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    th {
      background-color: #f8f9fa;
    }
    button {
      padding: 6px 12px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      margin-right: 5px;
    }
  `]
})
export class ExpenseListComponent {
  @Input() expenses: Expense[] = [];
  @Output() deleteExpense = new EventEmitter<number>();

  constructor(private router: Router) {}

  onAddExpense() {
    this.router.navigate(['/add-expense']);
  }

  onEdit(id: number | undefined) {
    if (id) {
      this.router.navigate(['/edit-expense', id]);
    }
  }

  onDelete(id: number | undefined) {
    if (id && confirm('Are you sure you want to delete this expense?')) {
      this.deleteExpense.emit(id);
    }
  }
}