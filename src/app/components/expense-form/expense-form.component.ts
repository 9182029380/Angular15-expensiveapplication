import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ExpenseService } from '../../services/expense.service';

@Component({
  selector: 'app-expense-form',
  template: `
    <div class="form-container">
      <h2>{{ isEditing ? 'Edit' : 'Add' }} Expense</h2>
      
      <form [formGroup]="expenseForm" (ngSubmit)="onSubmit()">
        <div class="form-field">
          <label for="title">Title</label>
          <input id="title" type="text" formControlName="title">
          <div class="error" *ngIf="expenseForm.get('title')?.errors?.['required'] && expenseForm.get('title')?.touched">
            Title is required
          </div>
        </div>

        <div class="form-field">
          <label for="amount">Amount</label>
          <input id="amount" type="number" formControlName="amount">
          <div class="error" *ngIf="expenseForm.get('amount')?.errors?.['required'] && expenseForm.get('amount')?.touched">
            Amount is required
          </div>
        </div>

        <div class="form-field">
          <label for="category">Category</label>
          <select id="category" formControlName="category">
            <option value="">Select Category</option>
            <option *ngFor="let category of categories" [value]="category.name">
              {{category.name}}
            </option>
          </select>
        </div>

        <div class="form-field">
          <label for="date">Date</label>
          <input id="date" type="date" formControlName="date">
        </div>

        <div class="form-field">
          <label for="description">Description</label>
          <textarea id="description" formControlName="description"></textarea>
        </div>

        <div class="form-actions">
          <button type="submit" [disabled]="!expenseForm.valid">
            {{ isEditing ? 'Update' : 'Add' }} Expense
          </button>
          <button type="button" (click)="onCancel()">Cancel</button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .form-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .form-field {
      margin-bottom: 20px;
    }
    label {
      display: block;
      margin-bottom: 5px;
    }
    input, select, textarea {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    .error {
      color: red;
      font-size: 0.8em;
      margin-top: 5px;
    }
    .form-actions {
      display: flex;
      gap: 10px;
    }
    button {
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    button[type="submit"] {
      background: #4CAF50;
      color: white;
    }
    button[disabled] {
      background: #cccccc;
      cursor: not-allowed;
    }
  `]
})
export class ExpenseFormComponent implements OnInit {
  expenseForm: FormGroup;
  isEditing = false;
  categories: any[] = [];

  constructor(
    private fb: FormBuilder,
    private expenseService: ExpenseService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.expenseForm = this.fb.group({
      title: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      date: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit() {
    this.loadCategories();
    
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditing = true;
      this.expenseService.getExpense(id).subscribe(expense => {
        return this.expenseForm.patchValue(expense || {});
      });
    }
  }

  loadCategories() {
    this.expenseService.getCategories().subscribe(
      categories => this.categories = categories
    );
  }

  onSubmit() {
    if (this.expenseForm.valid) {
      const expense = this.expenseForm.value;
      
      if (this.isEditing) {
        const id = this.route.snapshot.params['id'];
        expense.id = id;
        this.expenseService.updateExpense(expense).subscribe(() => {
          this.router.navigate(['/dashboard']);
        });
      } else {
        this.expenseService.addExpense(expense).subscribe(() => {
          this.router.navigate(['/dashboard']);
        });
      }
    }
  }

  onCancel() {
    this.router.navigate(['/dashboard']);
  }
}