import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-calculator',
  imports: [MatFormFieldModule, MatSelectModule, MatInputModule, FormsModule],
  templateUrl: './calculator.component.html',
  styleUrl: './calculator.component.scss'
})
export class CalculatorComponent {
  components= [
    {id: 1, name: 'Resistor'},
    {id: 2, name: 'Inductor'},
    {id: 3, name: 'Capacitor'},
  ];

  allTypes= [
    {id: 1, name: 'A', cId: 1},
    {id: 2, name: 'B', cId:1},
    {id: 3, name: 'C', cId:2},
    {id: 4, name: 'D', cId:2},
    {id: 5, name: 'E', cId:3},
    {id: 5, name: 'F', cId:3}
  ];

  componentType: any=[]

  constructor(private cd: ChangeDetectorRef){

  }
  filterType(id:number){
    this.componentType = this.allTypes.filter(type=> type.cId === id);
    this.cd.detectChanges();
  }

}
