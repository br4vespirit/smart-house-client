import { Component } from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Device} from "../../../models/device.model";

@Component({
  selector: 'app-create-device-modal',
  templateUrl: './create-device-modal.component.html',
  styleUrls: ['./create-device-modal.component.css']
})
export class CreateDeviceModalComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateDeviceModalComponent>
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      location: [''],
      hardwareModel: [''],
      labels: this.fb.array([])
    });
  }

  addString() {
    this.labels.push(this.fb.control('', [Validators.required]));
  }

  removeString(index: number) {
    this.labels.removeAt(index);
  }

  onSubmit() {
    if (this.form.valid) {
      let device = new Device({
        name: this.name?.value,
        description: this.description?.value,
        location: this.location?.value,
        hardware_model: this.hardwareModel?.value,
        labels: this.labels.value
      });
      this.dialogRef.close(device);
    }
  }

  get name() {
    return this.form.get('name');
  }

  get description() {
    return this.form.get('description');
  }

  get location() {
    return this.form.get('location');
  }

  get hardwareModel() {
    return this.form.get('hardwareModel');
  }

  get labels(): FormArray {
    return this.form.get('labels') as FormArray;
  }
}
