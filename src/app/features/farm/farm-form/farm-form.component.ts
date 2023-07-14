import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FarmDto } from '../../../api/models/farm-dto';
import { FarmResourceService } from '../../../api/services/farm-resource.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-farm-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './farm-form.component.html',
})
export class FarmFormComponent implements OnInit {

  @Input() type: 'CREATE' | 'UPDATE' | 'SEARCH' = 'SEARCH'; // Type of the form (CREATE, UPDATE, or SEARCH)
  @Input() inputValue: FarmDto; // Input value for pre-filled form (if available)
  @Output() onSearch: EventEmitter<string> = new EventEmitter<string>(); // Event emitter for search
  @Output() onCreate: EventEmitter<FarmDto> = new EventEmitter<FarmDto>(); // Event emitter for create/update

  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private service: FarmResourceService,
    private toast: ToastrService
  ) { }

  ngOnInit() {
    this.initForm();
  }

  // Initialize the form
  initForm() {
    this.form = this.formBuilder.group({
      id: [this.inputValue?.id ?? null, this.inputValue ? [Validators.required] : [], []],
      name: [this.inputValue?.name ?? null, [Validators.required]],
      location: [this.inputValue?.location ?? null, [Validators.required]],
      status: [this.inputValue?.status ?? null, [Validators.required]],
      description: [this.inputValue?.description ?? null, []],
    });
  }

  // Validate the form controls
  validateForm() {
    for (const i in this.form.controls) {
      this.form.controls[i].markAsTouched();
      this.form.controls[i].updateValueAndValidity();
    }
  }

  // Reset the form
  resetForm() {
    this.form.reset();
    for (const i in this.form.controls) {
      this.form.controls[i].markAsUntouched();
    }
  }

  // Cancel button click event
  onCancel() {
    this.type = 'SEARCH';
    this.form.reset();
  }

  // Search clear button click event
  onSearchClear() {
    this.form.reset();
    this.onSearch.emit(null);
  }

  // Form submission event
  onSubmit() {
    console.log('submit');
    this.validateForm();
    if (!this.form.invalid) {
      const data = this.form.value;

      if (!this.inputValue) {
        // Create farm
        this.service.createFarm({ body: data }).subscribe({
          next: (res) => {
            console.log(res);
            this.onCreate.emit(this.form.value);
            this.toast.success('Farm Created Successfully');
            this.resetForm();
          },
          error: (err) => {
            this.toast.error('Failed to Create the Farm');
            console.log(err);
          },
        });
      } else {
        // Update farm
        this.service.updateFarm({ body: data, id: this.inputValue.id }).subscribe({
          next: (res) => {
            console.log(res);
            this.onCreate.emit(this.form.value);
            this.toast.success('Farm Updated Successfully');
            this.resetForm();
          },
          error: (err) => {
            this.toast.error('Failed to Update the Farm');
            console.log(err);
          },
        });
      }

    } else {
      console.log('invalid');
    }
  }

  // Search button click event
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
      filter += `location ~~ '%${data.location}%'`;
    }

    if (data.description) {
      if (filter.length > 0) {
        filter += ` or `;
      }
      filter += `description ~~ '%${data.description}%'`;
    }

    if (data.status) {
      if (filter.length > 0) {
        filter += ` and `;
      }
      filter += `status : '${data.status}'`;
    }

    this.onSearch.emit(filter);
  }
}
