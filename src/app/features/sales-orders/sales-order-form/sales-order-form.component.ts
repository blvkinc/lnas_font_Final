import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OrderDto } from '../../../api/models/order-dto';
import { OrderResourceService } from '../../../api/services/order-resource.service';
import { PlantResourceService } from '../../../api/services/plant-resource.service';
import { PlantDto } from '../../../api/models/plant-dto';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sales-order-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sales-order-form.component.html',
})
export class SalesOrderFormComponent implements OnInit {

  @Input() type: 'CREATE' | 'UPDATE' | 'SEARCH' = 'SEARCH';
  @Input() inputValue: OrderDto;
  @Output() onSearch: EventEmitter<string> = new EventEmitter<string>();
  @Output() onCreate: EventEmitter<OrderDto> = new EventEmitter<OrderDto>();

  form: FormGroup;
  plantList: PlantDto[];

  constructor(
    private formBuilder: FormBuilder,
    private service: OrderResourceService,
    private plantService: PlantResourceService,
    private toast: ToastrService,
  ) { }

  get items(): FormArray {
    return this.form.get('items') as FormArray;
  }

  ngOnInit() {
    // Fetch plant data for the dropdown
    this.fetchData();
    // Initialize the form
    this.initForm();
  }

  fetchData() {
    // Fetch the list of plants for the dropdown
    this.plantService.paginatePlants().subscribe({
      next: (res) => {
        this.plantList = res.content;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  initForm() {
    // Initialize the form with default values and validators
    this.form = this.formBuilder.group({
      id: [this.inputValue?.id ?? null, this.inputValue ? [Validators.required] : []],
      invoiceNo: [this.inputValue?.id ?? null, this.inputValue ? [Validators.required] : []],
      status: [this.inputValue?.status ?? null, [Validators.required]],
      type: [this.inputValue?.type ?? null, [Validators.required]],
      subtotal: [this.inputValue?.subtotal ?? null, [Validators.required]],
      discount: [this.inputValue?.discount ?? null, []],
      tax: [this.inputValue?.tax ?? null, []],
      shipping: [this.inputValue?.shipping ?? null, []],
      total: [this.inputValue?.total ?? null, [Validators.required]],
      transactionMethod: [this.inputValue?.transactionMethod ?? null, [Validators.required]],
      items: this.formBuilder.array([]),
    });
  }

  initItemForm(): FormGroup {
    // Initialize a form group for an item in the items FormArray
    return this.formBuilder.group({
      id: [this.inputValue?.id ?? null, this.inputValue ? [Validators.required] : []],
      invoiceNo: [null, [], []],
      plant: [null, [Validators.required]],
      price: [null, [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      discount: [null, [Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      qty: [null, [Validators.required]],
      description: [null, []],
    });
  }

  addItem(): void {
    // Add a new item form group to the items FormArray
    const itemsFormArray = this.form.get('items') as FormArray;
    itemsFormArray.push(this.initItemForm());
  }

  removeItem(index: number): void {
    // Remove an item form group from the items FormArray at the specified index
    const itemsFormArray = this.form.get('items') as FormArray;
    itemsFormArray.removeAt(index);
  }

  validateForm() {
    // Mark all form controls as touched and update their validity
    for (const i in this.form.controls) {
      this.form.controls[i].markAsTouched();
      this.form.controls[i].updateValueAndValidity();
    }
  }

  resetForm() {
    // Reset the form and mark all form controls as untouched
    this.form.reset();
    for (const i in this.form.controls) {
      this.form.controls[i].markAsUntouched();
    }
  }

  onCancel() {
    // Set the form type to SEARCH and reset the form
    this.type = 'SEARCH';
    this.form.reset();
  }

  onSearchClear() {
    // Reset the form and emit null to clear the search filter
    this.form.reset();
    this.onSearch.emit(null);
  }

  onSubmit() {
    console.log('submit');
    // Validate the form
    this.validateForm();
    if (!this.form.invalid) {
      const data = this.form.value;

      if (!this.inputValue) {
        // Create a new order if inputValue is not provided
        this.service.createOrder({ body: data }).subscribe({
          next: (res) => {
            console.log(res);
            // Emit the created order and show success toast message
            this.onCreate.emit(this.form.value);
            this.toast.success('Sales Order Created Successfully');
            this.resetForm();
          },
          error: (err) => {
            this.toast.error('Failed to Create the Sale Order');
            console.log(err);
          },
        });
      } else {
        // Update the order if inputValue is provided
        this.service.updateOrder({ body: data, id: this.inputValue.id }).subscribe({
          next: (res) => {
            console.log(res);
            // Emit the updated order and show success toast message
            this.onCreate.emit(this.form.value);
            this.toast.success('Sale Order Updated Successfully');
            this.resetForm();
          },
          error: (err) => {
            this.toast.error('Sale Order Update Failed');
            console.log(err);
          },
        });
      }

    } else {
      console.log('invalid');
    }
  }

  onSearchClick() {
    const data = this.form.value;
    let filter = ``;

    if (data.invoiceNo) {
      filter += `documentId ~~ '%${data.invoiceNo}%'`;
    }

    if (data.type) {
      filter += `type ~~'%${data.type}%'`;
    }

    if (data.status) {
      if (filter.length > 0) {
        filter += ` and `;
      }
      filter += `status : '${data.status}'`;
    }

    // Emit the search filter string
    this.onSearch.emit(filter);
  }
}
