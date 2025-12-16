import {Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {NgIf, DecimalPipe} from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';

import {ComponentsService} from '../../services/components/components.service';
import {CompCategory, CompType, Environment, CalculatorRequest, CalculatorResponse} from '../../interfaces/interface';

@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [
    MatFormFieldModule, MatSelectModule, MatInputModule, 
    FormsModule, NgIf, MatButtonModule, MatCardModule, 
    DecimalPipe, BaseChartDirective
  ],
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss']
})
export class CalculatorComponent implements OnInit {
  
  categories: CompCategory[] = [];
  componentTypes: CompType[] = [];
  environments: Environment[] = [];

  qualityOptions = [
    { name: 'Standard Commercial', value: 1.0 },
    { name: 'High Reliability (Screened)', value: 0.1 },
    { name: 'Lower Grade', value: 3.0 }
  ];

  selectedCategoryId: number | null = null;
  selectedTypeId: number | null = null;
  selectedEnvId: number | null = null;
  
  // Inputs
  tempInput: number = 40;
  voltOpInput: number = 0;
  voltRatedInput: number = 0;
  powerOpInput: number = 0; 
  currOpInput: number = 0;
  currRatedInput: number = 0;
  
  // NEW Inputs
  qualityInput: number = 1.0; 
  dutyCycleInput: number = 100;

  loading: boolean = false;
  result: CalculatorResponse | null = null;

  // Chart Config
  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Reliability R(t)',
        fill: true,
        tension: 0.4,
        borderColor: '#198754',
        backgroundColor: 'rgba(25, 135, 84, 0.1)',
        pointBackgroundColor: '#fff',
        pointBorderColor: '#198754',
      }
    ]
  };

  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: false,
        title: { display: true, text: 'Probability of Survival (%)' }
      },
      x: {
        title: { display: true, text: 'Time (Years)' }
      }
    },
    plugins: { legend: { display: true } }
  };
  public lineChartLegend = true;

  constructor(private componentService: ComponentsService) {}

  ngOnInit() { this.loadInitialData(); }

  loadInitialData() {
    this.loading = true;
    this.componentService.getCategories().subscribe({
      next: (data) => this.categories = data,
      error: () => this.loading = false
    });
    this.componentService.getEnvironments().subscribe({
      next: (data) => {
        this.environments = data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  onCategorySelect(id: number) {
    this.selectedCategoryId = id;
    this.selectedTypeId = null;
    this.loading = true;
    this.componentService.getComponentTypes(id).subscribe({
      next: (data) => {
        this.componentTypes = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        alert("Failed");
      }
    });
  }

  onCalculate() {
    if (!this.selectedTypeId || !this.selectedEnvId) {
      alert("Please select Type and Environment");
      return;
    }

    this.loading = true;
    const payload: CalculatorRequest = {
      component_type_id: this.selectedTypeId,
      environment_id: this.selectedEnvId,
      temperature: this.tempInput,
      operating_voltage: this.voltOpInput,
      rated_voltage: this.voltRatedInput,
      operating_power: this.powerOpInput,
      operating_current: this.currOpInput,
      rated_current: this.currRatedInput,
      quality_factor: this.qualityInput
    };

    this.componentService.calculateFailureRate(payload).subscribe({
      next: (response) => {
        this.result = response;
        this.loading = false;
        this.updateChart(response.lambda_final_fit);
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        alert("Calculation Failed");
      }
    });
  }

  updateChart(lambdaFit: number) {
    const labels = [];
    const dataPoints = [];
    const dutyRatio = this.dutyCycleInput / 100.0;

    for (let year = 0; year <= 20; year++) {
      labels.push(year.toString());
      
      const calendarHours = year * 8760; 
      const operatingHours = calendarHours * dutyRatio;
      
      const lambdaHours = lambdaFit * 1e-9;
      const reliability = Math.exp(-lambdaHours * operatingHours);
      
      dataPoints.push(reliability * 100);
    }

    this.lineChartData = {
      labels: labels,
      datasets: [{
        ...this.lineChartData.datasets[0],
        data: dataPoints
      }]
    };
  }
}