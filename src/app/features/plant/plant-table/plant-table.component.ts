import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlantDto } from '../../../api/models/plant-dto';
import { PlantResourceService } from '../../../api/services/plant-resource.service';
import { SecurityModule } from 'src/app/security/security.module';

@Component({
  selector: 'app-plant-table',
  standalone: true,
  imports: [CommonModule, SecurityModule],
  templateUrl: './plant-table.component.html',
})
export class PlantTableComponent implements OnInit {

  @Output() onEdit: EventEmitter<PlantDto> = new EventEmitter<PlantDto>(); // Event emitter for edit

  plants: PlantDto[] = []; // Array to hold plant data
  currentPage = 1; // Current page number
  pageSize = 5; // Number of items to display per page
  totalElements = 0; // Total number of plant elements
  sortBy = ['id,asc']; // Sorting criteria
  filter = ''; // Filter criteria

  pageNumbers: number[] = []; // Array to hold page numbers
  totalPages: number; // Total number of pages

  constructor(
    private service: PlantResourceService, // Plant resource service for fetching data
  ) {}

  ngOnInit(): void {
    this.fetchData(); // Fetch data on component initialization
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.fetchData(); // Fetch data when the page changes
  }

  onEditClick(plant: PlantDto) {
    this.onEdit.emit(plant); // Emit the edit event when a plant is clicked
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

    this.service.paginatePlants(params).subscribe({
      next: (data) => {
        this.plants = data.content; // Set the plants array with the fetched data
        this.totalElements = data.totalElements; // Set the total number of elements
        this.totalPages = data.totalPages; // Set the total number of pages
        this.pageNumbers = new Array(data.totalPages).fill(0).map((x, i) => i + 1); // Generate an array of page numbers
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  toggleSortOrder(): void {
    this.sortBy = this.sortBy[0] === 'id,asc' ? ['id,desc'] : ['id,asc']; // Toggle the sorting order
    this.fetchData(); // Fetch data with the new sorting order
  }
}
