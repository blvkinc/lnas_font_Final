import { Component, OnInit } from '@angular/core';
import { PurchaseDto } from '../../../api/models/purchase-dto';
import { PurchaseResourceService } from '../../../api/services/purchase-resource.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-purchase-order-view',
  templateUrl: './purchase-order-view.component.html',
})
export class PurchaseOrderViewComponent implements OnInit {

  purchaseOrder: PurchaseDto;

  constructor(
    private activatedRoute: ActivatedRoute,
    private purchaseService: PurchaseResourceService,
  ) {}

  ngOnInit(): void {
    // Get the 'id' parameter from the route snapshot
    const id = this.activatedRoute.snapshot.params.id;
    // Fetch the purchase order data
    this.fetchData(id);
  }

  fetchData(id: number) {
    // Call the 'getPurchase' method from the purchase service
    // and subscribe to the result
    this.purchaseService.getPurchase({ id }).subscribe({
      next: (data) => {
        // Assign the retrieved purchase order data to the 'purchaseOrder' property
        this.purchaseOrder = data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
