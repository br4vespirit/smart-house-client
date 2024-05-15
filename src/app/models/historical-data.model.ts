export class HistoricalData {
    enqueuedTime?: string
    body?: string

    constructor(partial: Partial<HistoricalData>) {
        Object.assign(this, partial);
    }
}
