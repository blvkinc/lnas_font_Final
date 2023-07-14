import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupplierDto } from '../../../api/models/supplier-dto';
import { SupplierResourceService } from '../../../api/services/supplier-resource.service';
import { SecurityModule } from 'src/app/security/security.module';

@Component({
  selector: 'app-supplier-table',
  standalone: true,
  imports: [CommonModule, SecurityModule],
  templateUrl: './supplier-table.component.html',
})
export class SupplierTableComponent implements OnInit {
  @Output() onEdit: EventEmitter<SupplierDto> = new EventEmitter<SupplierDto>();

  suppliers: SupplierDto[] = [];
  currentPage = 1;
  pageSize = 5;
  totalElements = 0;
  sortBy = ['id,desc'];
  filter = '';

  pageNumbers: number[] = [];
  totalPages: number;

  constructor(
    private service: SupplierResourceService,
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

  onEditClick(supplier: SupplierDto) {
    // Emit the edit event with the selected supplier
    this.onEdit.emit(supplier);
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
    // Call the service to fetch suppliers based on the parameters
    this.service.paginateSuppliers(params).subscribe({
      next: (data) => {
        // Update the suppliers array, totalElements, totalPages, and pageNumbers
        this.suppliers = data.content;
        this.totalElements = data.totalElements;
        this.totalPages = data.totalPages;
        this.pageNumbers = new Array(data.totalPages).fill(0).map((x, i) => i + 1);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  toggleSortOrder(): void {
    // Toggle the sort order between ascending and descending based on the current sortBy value
    this.sortBy = this.sortBy[0] === 'id,asc' ? ['id,desc'] : ['id,asc'];
    this.fetchData();
  }
}
