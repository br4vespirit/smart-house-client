import { Component } from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-create-device-modal',
  templateUrl: './create-device-modal.component.html',
  styleUrls: ['./create-device-modal.component.css']
})
export class CreateDeviceModalComponent {
  constructor(
    private dialogRef: MatDialogRef<CreateDeviceModalComponent>
  ) { }

  onSubmit(queryName: string) {
    this.dialogRef.close(queryName);
  }
}
