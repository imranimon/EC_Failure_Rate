import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatGridListModule } from '@angular/material/grid-list';
import { CompType, CompCategory } from '../../interfaces/interface';

export interface DialogData {
  mode: 'add' | 'edit' | 'view';
  category_id?: number;
  category_name?: string;
  component?: CompType;
}

@Component({
  selector: 'app-component-dialog',
  standalone: true,
  imports: [
    CommonModule, FormsModule, 
    MatDialogModule, MatFormFieldModule, MatInputModule, 
    MatButtonModule, MatSelectModule
  ],
  templateUrl: './component-dialog.component.html',
  styleUrls: ['./component-dialog.component.scss']
})
export class ComponentDialogComponent {


  formHeader: string = '';
  isViewOnly: boolean = false;

  dataModel: any = {
    name: '',
    lambda_ref: 0.1,
    ref_temp: 40,
    thermal_resistance: 0,
    activation_energy: 0.7,
    ref_voltage_ratio: 0.5,
    c1_factor: 0,
    c2_factor: 0,
    c3_factor: 0,
    c4_factor: 0,
    category: 0
  };

  constructor(
    public dialogRef: MatDialogRef<ComponentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.initDialog();
  }

  initDialog() {
    this.isViewOnly = this.data.mode === 'view';

    if (this.data.mode === 'add') {
      this.formHeader = `Add New ${this.data.category_name}`;
      this.dataModel.category = this.data.category_id; 
    } 
    else if (this.data.mode === 'edit') {
      this.formHeader = `Edit ${this.data.component?.name}`;
      this.dataModel = { ...this.data.component }; 
    }
    else {
      this.formHeader = `Details: ${this.data.component?.name}`;
      this.dataModel = { ...this.data.component };
    }
  }

  onSave() {
    this.dialogRef.close(this.dataModel);
  }

  onCancel() {
    this.dialogRef.close();
  }
}