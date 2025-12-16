import { Routes } from '@angular/router';
import { CalculatorComponent } from './components/calculator/calculator.component';
import { ConfigManagerComponent } from './components/config-manager/config-manager.component';

export const routes: Routes = [
    { path: 'calculator', component: CalculatorComponent },
    { path: 'config', component: ConfigManagerComponent },
    { path: '', redirectTo: '/calculator', pathMatch: 'full' } 
];