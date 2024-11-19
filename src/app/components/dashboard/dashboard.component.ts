import { Component, OnInit } from '@angular/core';
import { ExpenseService } from '../../services/expense.service';
import { Expense } from '../../models/expense.model';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="dashboard">
      <h1>Expense Tracker Dashboard</h1>
      
      <div class="summary-cards">
        <div class="card">
          <h3>Total Expenses</h3>
          <p>{{ getTotalExpenses() | currency }}</p>
        </div>
        <div class="card">
          <h3>This Month</h3>
          <p>{{ getCurrentMonthExpenses() | currency }}</p>
        </div>
      </div>

      <div class="charts">
        <app-expense-chart [expenses]="expenses"></app-expense-chart>
      </div>

      <app-expense-list 
        [expenses]="expenses"
        (deleteExpense)="onDeleteExpense($event)">
      </app-expense-list>
    </div>
  `,
  styles: [`
    .dashboard {
      padding: 20px;
    }
    .summary-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }
    .card {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .charts {
      margin-bottom: 30px;
    }
  `]
})
export class DashboardComponent implements OnInit {
  expenses: Expense[] = [];

  constructor(private expenseService: ExpenseService) {}

  ngOnInit() {
    this.loadExpenses();
  }

  loadExpenses() {
    this.expenseService.getExpenses().subscribe(
      expenses => this.expenses = expenses
    );
  }

  getTotalExpenses(): number {
    return this.expenses.reduce((sum, exp) => sum + exp.amount, 0);
  }

  getCurrentMonthExpenses(): number {
    const currentMonth = new Date().getMonth();
    return this.expenses
      .filter(exp => new Date(exp.date).getMonth() === currentMonth)
      .reduce((sum, exp) => sum + exp.amount, 0);
  }

  onDeleteExpense(id: number) {
    this.expenseService.deleteExpense(id).subscribe(() => {
      this.loadExpenses();
    });
  }
}