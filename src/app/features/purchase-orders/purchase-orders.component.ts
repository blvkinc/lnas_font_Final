import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurchaseDto } from '../../api/models/purchase-dto';
import { PurchaseOrderFormComponent } from './purchase-order-form/purchase-order-form.component';
import { PurchaseOrderTableComponent } from './purchase-order-table/purchase-order-table.component';
import { CustomerFormComponent } from '../customer/customer-form/customer-form.component';
import { CustomerTableComponent } from '../customer/customer-table/customer-table.component';
import { RouterLink } from '@angular/router';
import { SecurityModule } from 'src/app/security/security.module';

@Component({
  selector: 'app-purchase-orders',
  standalone: true,
  imports: [
    CommonModule,
    CustomerFormComponent,
    CustomerTableComponent,
    RouterLink,
    PurchaseOrderFormComponent,
    PurchaseOrderTableComponent,
    SecurityModule
  ],
  templateUrl: './purchase-orders.component.html',
})
export class PurchaseOrdersComponent {
  @ViewChild(PurchaseOrderTableComponent) table: PurchaseOrderTableComponent;
  @ViewChild(PurchaseOrderFormComponent) form: PurchaseOrderFormComponent;

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
  onEdit($event: PurchaseDto) {
    // Set the input value and type in the form component
    this.form.inputValue = $event;
    this.form.type = 'UPDATE';
    // Initialize the form with the new input value
    this.form.initForm();
    // Scroll to the top of the page
    window.scroll(0, 0);
  }
}
