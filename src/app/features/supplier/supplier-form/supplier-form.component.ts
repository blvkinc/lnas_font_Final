import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SupplierDto } from '../../../api/models/supplier-dto';
import { SupplierResourceService } from '../../../api/services/supplier-resource.service';
import { SecurityModule } from 'src/app/security/security.module';

@Component({
  selector: 'app-supplier-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SecurityModule],
  templateUrl: './supplier-form.component.html',
})
export class SupplierFormComponent implements OnInit {
  @Input() type: 'CREATE' | 'UPDATE' | 'SEARCH' = 'SEARCH';
  @Input() inputValue: SupplierDto;
  @Output() onSearch: EventEmitter<string> = new EventEmitter<string>();
  @Output() onCreate: EventEmitter<SupplierDto> = new EventEmitter<SupplierDto>();

  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private service: SupplierResourceService,
  ) {}

  ngOnInit() {
    // Initialize the form
    this.initForm();
  }

  initForm() {
    // Initialize the form with default values and validators
    this.form = this.formBuilder.group({
      id: [this.inputValue?.id ?? null, this.inputValue ? [Validators.required] : []],
      firstName: [this.inputValue?.firstName ?? null, [Validators.required]],
      lastName: [this.inputValue?.lastName ?? null, [Validators.required]],
      email: [this.inputValue?.email ?? null],
      phone: [this.inputValue?.phone ?? null],
      address: [this.inputValue?.address ?? null, [Validators.required]],
      status: [this.inputValue?.status ?? null, [Validators.required]],
    });
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
        // Create a new supplier if inputValue is not provided
        this.service.createSupplier({ body: data }).subscribe({
          next: (res) => {
            console.log(res);
            // Emit the created supplier and reset the form
            this.onCreate.emit(this.form.value);
            this.resetForm();
          },
          error: (err) => {
            console.log(err);
          },
        });
      } else {
        // Update the supplier if inputValue is provided
        this.service.updateSupplier({ body: data, id: this.inputValue.id }).subscribe({
          next: (res) => {
            console.log(res);
            // Emit the updated supplier and reset the form
            this.onCreate.emit(this.form.value);
            this.resetForm();
          },
          error: (err) => {
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

    if (data.firstName) {
      filter += `firstName ~~ '%${data.firstName}%'`;
    }

    if (data.lastName) {
      filter += `lastName ~~ '%${data.lastName}%'`;
    }

    if (data.email) {
      filter += `email ~~ '%${data.email}%'`;
    }

    if (data.phone) {
      filter += `phone ~~ '%${data.phone}%'`;
    }

    if (data.address) {
      filter += `address ~~ '%${data.address}%'`;
    }

    if (data.status) {
      if (filter.length > 0) {
        filter += ` and `;
      }
      filter += `status : '${data.status}'`;
    }
    console.log(filter);
    // Emit the search filter string
    this.onSearch.emit(filter);
  }
}
