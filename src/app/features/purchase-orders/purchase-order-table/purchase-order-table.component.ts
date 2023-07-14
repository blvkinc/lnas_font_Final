import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurchaseDto } from '../../../api/models/purchase-dto';
import { PurchaseResourceService } from '../../../api/services/purchase-resource.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-purchase-order-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './purchase-order-table.component.html',
})
export class PurchaseOrderTableComponent implements OnInit {

  @Output() onEdit: EventEmitter<PurchaseDto> = new EventEmitter<PurchaseDto>();

  purchaseOrders: PurchaseDto[] = [];
  currentPage = 1;
  pageSize = 5;
  totalElements = 0;
  sortBy = ['id,desc'];
  filter = '';

  pageNumbers: number[] = [];
  totalPages: number;

  constructor(
    private service: PurchaseResourceService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    // Fetch initial data when the component initializes
    this.fetchData();
  }

  onPageChange(page: number): void {
    // Update the current page and fetch data for the new page
    this.currentPage = page;
    this.fetchData();
  }

  onEditClick(purchaseOrder: PurchaseDto) {
    // Emit the 'onEdit' event with the selected purchase order
    this.onEdit.emit(purchaseOrder);
  }

  fetchData(): void {
    // Prepare the request parameters
    let params = {
      page: this.currentPage - 1,
      size: this.pageSize,
      sort: this.sortBy,
    };

    if (this.filter.length > 0) {
      params['filter'] = this.filter;
    }

    // Fetch purchase orders using the service and subscribe to the result
    this.service.paginatePurchases(params).subscribe({
      next: (data) => {
        // Update the purchase orders list and pagination information
        this.purchaseOrders = data.content;
        this.totalElements = data.totalElements;
        this.totalPages = data.totalPages;
        this.pageNumbers = new Array(data.totalPages).fill(0).map((x, i) => i + 1);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  onViewClick(purchaseOrder: PurchaseDto) {
    // Navigate to the view page of the selected purchase order
    this.router.navigate([`home/purchase-orders/${purchaseOrder.id}`]);
  }

  toggleSortOrder(): void {
    // Toggle the sort order between ascending and descending based on the current sort order
    this.sortBy = this.sortBy[0] === 'id,asc' ? ['id,desc'] : ['id,asc'];
    // Fetch data with the new sort order
    this.fetchData();
  }

  onCloseClick(purchaseOrder: PurchaseDto) {
    // Close the purchase order using the service and subscribe to the result
    this.service.closePurchase({ id: purchaseOrder.id }).subscribe({
      next: (data) => {
        // Fetch updated data after closing the purchase order
        this.fetchData();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
