export class HistoricalPeriod {
    dateFrom?: Date;
    dateTo?: Date;

    constructor(partial: Partial<HistoricalPeriod>) {
        Object.assign(this, partial);
    }
}
