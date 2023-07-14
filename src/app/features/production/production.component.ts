import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductionTableComponent } from './production-table/production-table.component';
import { ProductionFormComponent } from './production-form/production-form.component';
import { ProductionDto } from '../../api/models/production-dto';
import { CustomerFormComponent } from '../customer/customer-form/customer-form.component';
import { CustomerTableComponent } from '../customer/customer-table/customer-table.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-production',
  standalone: true,
  imports: [
    CommonModule,
    CustomerFormComponent,
    CustomerTableComponent,
    RouterLink,
    ProductionFormComponent,
    ProductionTableComponent
  ],
  templateUrl: './production.component.html',
})
export class ProductionComponent {
  @ViewChild(ProductionTableComponent) table: ProductionTableComponent;
  @ViewChild(ProductionFormComponent) form: ProductionFormComponent;

  // Event handler for the search event
  onSearch($event: string) {
    console.log($event);
    // Set the filter value in the table component
    this.table.filter = $event;
    // Fetch data based on the new filter value
    this.table.fetchData();
  }

  // Event handler for the refresh event
  onRefresh() {
    // Fetch data to refresh the table
    this.table.fetchData();
  }

  // Event handler for the edit event
  onEdit($event: ProductionDto) {
    // Set the input value and type in the form component
    this.form.inputValue = $event;
    this.form.type = 'UPDATE';
    // Initialize the form with the new input value
    this.form.initForm();
    // Scroll to the top of the page
    window.scroll(0, 0);
  }
}
