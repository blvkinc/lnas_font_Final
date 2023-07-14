import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderDto } from '../../../api/models/order-dto';
import { OrderResourceService } from '../../../api/services/order-resource.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sales-order-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sales-order-table.component.html',
})
export class SalesOrderTableComponent implements OnInit {
  @Output() onEdit: EventEmitter<OrderDto> = new EventEmitter<OrderDto>();

  salesOrders: OrderDto[] = [];
  currentPage = 1;
  pageSize = 5;
  totalElements = 0;
  sortBy = ['id,desc'];
  filter = '';

  pageNumbers: number[] = [];
  totalPages: number;

  constructor(
    private service: OrderResourceService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    // Fetch initial data for the table
    this.fetchData();
  }

  onPageChange(page: number): void {
    // Update the current page and fetch data for the new page
    this.currentPage = page;
    this.fetchData();
  }

  onEditClick(order: OrderDto) {
    // Emit the edit event with the selected order
    this.onEdit.emit(order);
  }

  fetchData(): void {
    let params = {
      page: this.currentPage - 1,
      size: this.pageSize,
      sort: this.sortBy,
    };
    if (this.filter.length > 0) {
      params['filter'] = this.filter;
    }
    // Call the service to fetch orders based on the parameters
    this.service.paginateOrders(params).subscribe({
      next: (data) => {
        // Update the salesOrders array, totalElements, totalPages, and pageNumbers
        this.salesOrders = data.content;
        this.totalElements = data.totalElements;
        this.totalPages = data.totalPages;
        this.pageNumbers = new Array(data.totalPages).fill(0).map((x, i) => i + 1);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  onViewClick(order: OrderDto) {
    // Navigate to the view page for the selected order
    this.router.navigate([`home/sales-orders/${order.id}`]);
  }

  toggleSortOrder(): void {
    // Toggle the sort order between ascending and descending based on the current sortBy value
    this.sortBy = this.sortBy[0] === 'id,asc' ? ['id,desc'] : ['id,asc'];
    this.fetchData();
  }

  onCloseClick(order: OrderDto) {
    // Call the service to close the selected order
    this.service.closeOrder({ id: order.id }).subscribe({
      next: (data) => {
        // Refresh the data after closing the order
        this.fetchData();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
