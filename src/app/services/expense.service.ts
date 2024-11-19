import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { Expense } from '../models/expense.model';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private expenses: Expense[] = [
    {
      id: 1,
      title: "Groceries",
      amount: 150.50,
      category: "Food",
      date: "2024-01-15",
      description: "Weekly grocery shopping"
    },
    {
      id: 2,
      title: "Internet Bill",
      amount: 60.00,
      category: "Utilities",
      date: "2024-01-10",
      description: "Monthly internet subscription"
    }
  ];

  private categories = [
    {id: 1, name: "Food"},
    {id: 2, name: "Utilities"},
    {id: 3, name: "Transportation"},
    {id: 4, name: "Entertainment"},
    {id: 5, name: "Shopping"}
  ];

  private expensesSubject = new BehaviorSubject<Expense[]>(this.expenses);

  getExpenses(): Observable<Expense[]> {
    return this.expensesSubject.asObservable();
  }

  getExpense(id: number): Observable<Expense | undefined> {
    const expense = this.expenses.find(e => e.id === id);
    return of(expense);
  }

  addExpense(expense: Expense): Observable<Expense> {
    const newId = Math.max(...this.expenses.map(e => e.id || 0)) + 1;
    const newExpense = { ...expense, id: newId };
    this.expenses.push(newExpense);
    this.expensesSubject.next(this.expenses);
    return of(newExpense);
  }

  updateExpense(expense: Expense): Observable<Expense> {
    const index = this.expenses.findIndex(e => e.id === expense.id);
    if (index !== -1) {
      this.expenses[index] = expense;
      this.expensesSubject.next(this.expenses);
    }
    return of(expense);
  }

  deleteExpense(id: number): Observable<void> {
    const index = this.expenses.findIndex(e => e.id === id);
    if (index !== -1) {
      this.expenses.splice(index, 1);
      this.expensesSubject.next(this.expenses);
    }
    return of(void 0);
  }

  getCategories(): Observable<any[]> {
    return of(this.categories);
  }
}