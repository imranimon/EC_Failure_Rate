import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { forkJoin } from 'rxjs';

import { MatDialog } from '@angular/material/dialog';
import { ComponentDialogComponent, DialogData } from '../component-dialog/component-dialog.component';

import { ComponentsService } from '../../services/components/components.service';
import { CompCategory, CompType, Environment } from '../../interfaces/interface';

@Component({
  selector: 'app-config-manager',
  standalone: true,
  imports: [
    CommonModule, 
    MatTabsModule, MatExpansionModule, MatIconModule, 
    MatButtonModule, MatListModule, MatTableModule, MatCardModule
  ],
  templateUrl: './config-manager.component.html',
  styleUrls: ['./config-manager.component.scss']
})
export class ConfigManagerComponent implements OnInit {

  categories: CompCategory[] = [];
  environments: Environment[] = [];
  
  typesByCategory: { [key: number]: CompType[] | undefined } = {};
  
  loading = false;

  constructor(private api: ComponentsService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadData();
  }

loadData() {
    this.loading = true;
      this.api.getCategories().subscribe(cats => {
      this.categories = cats;
      
      const requestArray = this.categories.map(cat => 
        this.api.getComponentTypes(cat.id)
      );
      
      const envRequest = this.api.getEnvironments();

      forkJoin([envRequest, ...requestArray]).subscribe({
        next: (results) => {
          this.environments = results[0] as Environment[];

          const typeResults = results.slice(1) as CompType[][];

          typeResults.forEach((types, index) => {
             const catId = this.categories[index].id;
             this.typesByCategory[catId] = types;
          });

          this.loading = false; 
        },
        error: (err) => {
          console.error(err);
          this.loading = false; 
        }
      });
    });
  }

  onViewType(type: CompType) {
    this.dialog.open(ComponentDialogComponent, {
      width: '800px',
      data: { mode: 'view', component: type } as DialogData
    });
  }

 onDeleteType(id: number) {
    if(confirm('Are you sure you want to delete this component?')) {
      this.loading = true; 
      this.api.deleteComponentType(id).subscribe({
        next: () => {
          this.loadData();
        },
        error: (err) => {
          alert('Error deleting');
          this.loading = false; 
        }
      });
    }
  }

  onAddType(categoryId: number, categoryName: string) {
    const dialogRef = this.dialog.open(ComponentDialogComponent, {
      width: '800px',
      data: { mode: 'add', category_id: categoryId, category_name: categoryName } as DialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        this.api.addComponentType(result).subscribe({
          next: () => {
            this.loadData();
          },
          error: (err) => {
            alert('Error adding component');
            this.loading = false;
          }
        });
      }
    });
  }

  onEditType(type: CompType) {
    const dialogRef = this.dialog.open(ComponentDialogComponent, {
      width: '800px',
      data: { mode: 'edit', component: type } as DialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        this.api.updateComponentType(type.id, result).subscribe({
          next: () => {
            this.loadData();
          },
          error: (err) => {
            alert('Error updating component');
            this.loading = false;
          }
        });
      }
    });
  }
}