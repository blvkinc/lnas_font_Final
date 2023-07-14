import { Component, OnInit } from '@angular/core';
import { OrderDto } from '../../../api/models/order-dto';
import { ActivatedRoute } from '@angular/router';
import { OrderResourceService } from '../../../api/services/order-resource.service';

@Component({
  selector: 'app-sales-order-view',
  templateUrl: './sales-order-view.component.html',
})
export class SalesOrderViewComponent implements OnInit {
  salesOrder: OrderDto;

  constructor(
    private activatedRoute: ActivatedRoute,
    private service: OrderResourceService,
  ) {}

  ngOnInit(): void {
    // Fetch data for the sales order using the ID from the activated route
    this.fetchData(this.activatedRoute.snapshot.params.id);
  }

  fetchData(id: number) {
    // Call the service to get the sales order with the specified ID
    this.service.getOrder({ id }).subscribe({
      next: (data) => {
        // Assign the fetched sales order to the salesOrder property
        this.salesOrder = data;
        console.log(data);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
