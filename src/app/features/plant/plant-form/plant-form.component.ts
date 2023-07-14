import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PlantDto } from '../../../api/models/plant-dto';
import { PlantResourceService } from '../../../api/services/plant-resource.service';
import { SecurityModule } from 'src/app/security/security.module';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-plant-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SecurityModule],
  templateUrl: './plant-form.component.html',
})
export class PlantFormComponent implements OnInit {

  // Input properties
  @Input() type: 'CREATE' | 'UPDATE' | 'SEARCH' = 'SEARCH';
  @Input() inputValue: PlantDto;

  // Output properties
  @Output() onSearch: EventEmitter<string> = new EventEmitter<string>();
  @Output() onCreate: EventEmitter<PlantDto> = new EventEmitter<PlantDto>();

  // Form group
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private service: PlantResourceService,
    private toast: ToastrService
  ) { }

  ngOnInit() {
    this.initForm();
  }

  // Initialize the form with the input values
  initForm() {
    this.form = this.formBuilder.group({
      name: [this.inputValue?.name ?? null, [Validators.required]],
      status: [this.inputValue?.status ?? null, [Validators.required]],
      description: [this.inputValue?.description ?? null, []],
      purchasePrice: [this.inputValue?.purchasePrice ?? null, [Validators.required]],
      qtyAtHand: [this.inputValue?.qtyAtHand ?? null, [Validators.required]],
      qtyPotential: [this.inputValue?.qtyPotential ?? null, [Validators.required]],
      salesPrice: [this.inputValue?.salesPrice ?? null, [Validators.required]],
      scientificName: [this.inputValue?.scientificName ?? null, []],
      productId: [this.inputValue?.productId ?? null, [Validators.required]],
    });
  }

  // Mark all form controls as touched to trigger validation messages
  validateForm() {
    for (const i in this.form.controls) {
      this.form.controls[i].markAsTouched();
      this.form.controls[i].updateValueAndValidity();
    }
  }

  // Reset the form and mark all controls as untouched
  resetForm() {
    this.form.reset();
    for (const i in this.form.controls) {
      this.form.controls[i].markAsUntouched();
    }
  }

  // Handle the cancel action
  onCancel() {
    this.type = 'SEARCH';
    this.form.reset();
  }

  // Clear the form and emit the search event with null value
  onSearchClear() {
    this.form.reset();
    this.onSearch.emit(null);
  }

  onSubmit() {
    console.log('submit');
    this.validateForm();

    if (!this.form.invalid) {
      const data = this.form.value;

      if (!this.inputValue) {
        // Create a new plant
        this.service.createPlant({ body: data }).subscribe({
          next: (res) => {
            console.log(res);
            this.onCreate.emit(this.form.value);
            this.toast.success('Plant Created Successfully');
            this.resetForm();
          },
          error: (err) => {
            this.toast.error('Failed to Create the Plant');
            console.log(err);
          },
        });
      } else {
        // Update an existing plant
        this.service.updatePlant({ body: data, id: this.inputValue.id }).subscribe({
          next: (res) => {
            console.log(res);
            this.onCreate.emit(this.form.value);
            this.toast.success('Plant Updated Successfully');
            this.resetForm();
          },
          error: (err) => {
            this.toast.error('Plant Update Failed');
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

    if (data.name) {
      filter += `name ~~ '%${data.name}%'`;
    }

    if (data.location) {
      if (filter.length > 0) {
        filter += ` or `;
      }
      filter += `scientificName ~~ '%${data.scientificName}%'`;
    }

    if (data.productId) {
      if (filter.length > 0) {
        filter += ` or `;
      }
      filter += `productId ~~ '%${data.productId}%'`;
    }

    if (data.status) {
      if (filter.length > 0) {
        filter += ` and `;
      }
      filter += `status : '${data.status}'`;
    }

    console.log(filter);
    this.onSearch.emit(filter);
  }
}
