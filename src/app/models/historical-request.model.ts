export class HistoricalRequest {
    deviceName?: string;
    dateFrom?: string;
    dateTo?: string;

    constructor(partial: Partial<HistoricalRequest>) {
        Object.assign(this, partial);
    }
}
