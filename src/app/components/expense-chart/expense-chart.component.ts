import { Component, Input, OnChanges } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { Expense } from '../../models/expense.model';

@Component({
  selector: 'app-expense-chart',
  template: `
    <div class="chart-container">
      <canvas baseChart
        [data]="chartData"
        [options]="chartOptions"
        [type]="'bar'">
      </canvas>
    </div>
  `,
  styles: [`
    .chart-container {
      height: 300px;
      margin: 20px 0;
    }
  `]
})
export class ExpenseChartComponent implements OnChanges {
  @Input() expenses: Expense[] = [];

  chartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: []
  };

  chartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
      }
    }
  };

  ngOnChanges() {
    this.updateChart();
  }

  private updateChart() {
    const categoryTotals = new Map<string, number>();
    
    this.expenses.forEach(expense => {
      const current = categoryTotals.get(expense.category) || 0;
      categoryTotals.set(expense.category, current + expense.amount);
    });

    this.chartData = {
      labels: Array.from(categoryTotals.keys()),
      datasets: [{
        data: Array.from(categoryTotals.values()),
        label: 'Expenses by Category',
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF'
        ]
      }]
    };
  }
}