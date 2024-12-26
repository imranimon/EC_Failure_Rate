import {Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {ChangeDetectorRef} from '@angular/core';
import {ComponentsService} from '../../services/components/components.service';
import {Comp, CompType} from '../../interfaces/interface';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-calculator',
  imports: [MatFormFieldModule, MatSelectModule, MatInputModule, FormsModule, NgIf],
  templateUrl: './calculator.component.html',
  styleUrl: './calculator.component.scss'
})
export class CalculatorComponent implements OnInit {
  components: Comp[] = [];
  componentType: CompType[] = []
  loading: boolean = false;

  constructor(private cd: ChangeDetectorRef,
              private componentService: ComponentsService) {

  }

  ngOnInit() {
    this.getAllComponents();
  }

  getAllComponents() {
    this.loading = true;
    this.componentService.getComponents().subscribe({
      next: (data: Comp[]) => {
        this.loading = false;
        if (data.length === 0) {
          alert('No Component Found')
        } else {
          this.components = data;
        }
      }, error: () => {
        this.loading = false;
        alert('Failed to load components.')
      }
    })
  }

  onSelectComponent(id: number) {
    this.loading = true;
    this.componentService.getComponentType(id).subscribe({
      next: (data: CompType[]) => {
        this.loading = false;
        if (data.length === 0) {
          alert('No-Type found for the selected component');
        } else {
          this.componentType = data;
        }
      }, error: () => {
        this.loading = false;
        alert('Failed to load component-types.')
      }
    })
  }

}
