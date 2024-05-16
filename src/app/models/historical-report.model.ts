export class HistoricalReport {
  deviceName?: string;
  dateFrom?: Date;
  dateTo?: Date;
  labels?: string[]

  constructor(partial: Partial<HistoricalReport>) {
    Object.assign(this, partial);
  }
}
