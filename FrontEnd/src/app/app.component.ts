import { Component } from '@angular/core';
import { HeaderComponent } from "./components/header/header.component";
import { CalculatorComponent } from "./components/calculator/calculator.component";

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, CalculatorComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'FrontEnd';
}
