import { Component } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MatDialogRef} from "@angular/material/dialog";
import {HistoricalPeriod} from "../../../models/historical-period.model";

@Component({
  selector: 'app-historical-form',
  templateUrl: './historical-form.component.html',
  styleUrls: ['./historical-form.component.css']
})
export class HistoricalFormComponent {
  form: FormGroup;

  constructor(
      private dialogRef: MatDialogRef<HistoricalFormComponent>
  ) {
    this.form = new FormGroup<any>({
      dateFrom: new FormControl('', [Validators.required]),
      dateTo: new FormControl('', [Validators.required])
    });

  }

  onSubmit() {
    let period = new HistoricalPeriod({
      dateFrom: this.dateFrom?.value,
      dateTo: this.dateTo?.value,
    })
    this.dialogRef.close(period);
  }

  get dateFrom() {
    if (this.form)
      return this.form.controls['dateFrom'];
    return null;
  }

  get dateTo() {
    if (this.form)
      return this.form.controls['dateTo'];
    return null;
  }
}
