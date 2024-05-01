import { Component } from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Device} from "../../../models/device.model";

@Component({
  selector: 'app-create-device-modal',
  templateUrl: './create-device-modal.component.html',
  styleUrls: ['./create-device-modal.component.css']
})
export class CreateDeviceModalComponent {
  form: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<CreateDeviceModalComponent>
  ) {
    this.form = new FormGroup<any>({
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      location: new FormControl('', []),
      hardwareModel: new FormControl('', [])
    });

  }

  onSubmit() {
    let device = new Device({
      name: this.name?.value,
      description: this.description?.value,
      location: this.location?.value,
      hardware_model: this.hardwareModel?.value
    })
    this.dialogRef.close(device);
  }

  get name() {
    if (this.form)
      return this.form.controls['name'];
    return null;
  }


  get description() {
    if (this.form)
      return this.form.controls['description'];
    return null;
  }


  get location() {
    if (this.form)
      return this.form.controls['location'];
    return null;
  }


  get hardwareModel() {
    if (this.form)
      return this.form.controls['hardwareModel'];
    return null;
  }

}
