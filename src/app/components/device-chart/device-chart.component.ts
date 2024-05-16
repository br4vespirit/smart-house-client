import {Component, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid
} from "ng-apexcharts";
import {WebSocketService} from "../../services/web-socket.service";
import {firstValueFrom, map, Subscription} from "rxjs";
import {HistoricalService} from "../../services/historical.service";
import {HistoricalData} from "../../models/historical-data.model";
import {MatDialog} from "@angular/material/dialog";
import {HistoricalFormComponent} from "../dashboard/historical-form/historical-form.component";
import {HistoricalPeriod} from "../../models/historical-period.model";
import { DatePipe } from '@angular/common';
import {HistoricalRequest} from "../../models/historical-request.model";
import {ScriptRequest} from "../../models/script-request.model";
import {ScriptService} from "../../services/script.service";
import {Device} from "../../models/device.model";
import {HistoricalReport} from "../../models/historical-report.model";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-device-chart',
  templateUrl: './device-chart.component.html',
  styleUrls: ['./device-chart.component.css']
})
export class DeviceChartComponent implements OnInit, OnDestroy {

  // @ts-ignore
  device: Device;
  isRealTimeGraphOpen: boolean = false;
  isHistoricalGraphOpen: boolean = false;

  // @ts-ignore
  @ViewChild("chart") charts: QueryList<ChartComponent>;
  // @ts-ignore
  public realTimeChartOptions: Partial<ChartOptions>[] = [];
  // @ts-ignore
  public historicalChartOptions: Partial<ChartOptions>[] = [];

  realTimeXAxis: string[] = [];
  historicalXAxis: string[] = [];

  realTimeData: number[][] = [];
  historicalData: number[][] = [];

  allHistoricalData: HistoricalData[] = [];

  webSocketSubscription: Subscription = new Subscription();
  historicalDataSubscription: Subscription = new Subscription();
  deviceSubscription: Subscription = new Subscription();
  historicalReportSubscription: Subscription = new Subscription();

  currentHistoricalDataIndex = 0;

  constructor(private webSocketService: WebSocketService,
              private historicalService: HistoricalService,
              private dialog: MatDialog,
              private scriptService: ScriptService,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap
      .pipe(map(() => window.history.state)).subscribe(res=>{
        this.device = res;
        this.webSocketService.initSocket(this.device.name!);

        for (let i = 0; i < this.device.labels?.length!; i++) {
          this.realTimeData.push([]);
        }
        for (let i = 0; i < this.device.labels?.length!; i++) {
          this.historicalData.push([]);
        }

        this.initRealTimeChartOptions();
        this.initHistoricalChartOptions(); // validate
      });
  }

  ngOnDestroy(): void {
    this.webSocketSubscription.unsubscribe();
    this.deviceSubscription.unsubscribe();
    this.historicalDataSubscription.unsubscribe();
    this.historicalReportSubscription.unsubscribe();
  }

  openRealTime() {
    this.isRealTimeGraphOpen = true;

    for (let i = 0; i < this.device.labels?.length!; i++) {
      this.realTimeData.push([]);
    }

    for (let j = 0; j < this.device.labels?.length!; j++) {
      for (let i = 1; i < 11; i++) {
        this.realTimeData[j].push(0);
      }
    }

    for (let i = 1; i < 11; i++) {
      this.realTimeXAxis.push("0");
    }

    this.webSocketSubscription = this.webSocketService.getMessage().subscribe({
      next: msg => {
        this.realTimeXAxis.shift()
        this.realTimeXAxis.push(msg.date)

        let data = msg.data;
        let dataKeys = Object.keys(data);

        for (let i = 0; i < this.device.labels?.length!; i++) {
          let key = dataKeys[i];

          // Access the value corresponding to the current key
          let value = data[key as keyof typeof data];

          if (this.realTimeData[i].length === 10) {
            this.realTimeData[i].shift();
            this.realTimeData[i].push(value);
            this.realTimeChartOptions[i] = {
              ...this.realTimeChartOptions[i],
              series: [
                {
                  name: this.device.labels![i],
                  data: this.realTimeData[i]
                }
              ],
              xaxis: {
                categories: this.realTimeXAxis
              }
            };
          }
        }
      },
      error: msg => {
        console.error(msg);
      }
    });
  }

  closeRealTime() {
    this.webSocketSubscription.unsubscribe();
    this.realTimeXAxis = [];

    // this.realTimeData = [];
    for (let i = 0; i < this.device.labels?.length!; i++) {
      this.realTimeData[i] = [];
    }

    this.isRealTimeGraphOpen = false;

    for (let i = 0; i < this.device.labels?.length!; i++) {
      this.realTimeChartOptions[i] = {
        ...this.realTimeChartOptions[i],
        series: [
          {
            data: []
          }
        ]
      };
    }
  }

  async openHistorical() {
    const result = await this.openModal();

    if (result !== false) {

      let r = result as HistoricalPeriod;

      // @ts-ignore
      let formattedDateFrom: string = new DatePipe('en-US').transform(r.dateFrom, 'yyyy-MM-dd HH:mm:ss');
      // @ts-ignore
      let formattedDateTo: string = new DatePipe('en-US').transform(r.dateTo, 'yyyy-MM-dd HH:mm:ss');
      let request: HistoricalRequest = new HistoricalRequest({
        deviceName: this.device.name,
        dateFrom: formattedDateFrom,
        dateTo: formattedDateTo
      });

      this.isHistoricalGraphOpen = true;
      this.historicalDataSubscription = this.historicalService.fetchHistoricalData(request).subscribe(
          data => {
            this.allHistoricalData = data as HistoricalData[]
            this.openHistoricalCharts();
          }
      )
    }
  }

  async openModal(): Promise<HistoricalPeriod | boolean> {
    const dialogRef = this.dialog.open(HistoricalFormComponent, {
      width: '400px'
    });

    return await firstValueFrom(dialogRef.afterClosed());
  }

  openHistoricalCharts() {
    // this.isHistoricalGraphOpen = true;

    // this.generateRandomData();

    for (let i = 0; i < 10; i++) {
      this.parseData(i);
    }

    this.currentHistoricalDataIndex = 10;

    this.updateHistoricalChartOptions();
  }

  private parseData(i: number) {
    this.historicalXAxis.push(this.allHistoricalData[i].enqueuedTime!)
    const dataObject = JSON.parse(atob(this.allHistoricalData[i].body!));
    const data = dataObject.data;

    let dataKeys = Object.keys(data);

    for (let k = 0; k < this.device.labels?.length!; k++) {
      let key = dataKeys[k];
      let value = data[key as keyof typeof data];
      this.historicalData[k].push(value);
    }
  }

  closeHistorical() {
    this.allHistoricalData = [];
    this.historicalXAxis = [];

    for (let i = 0; i < this.device.labels?.length!; i++) {
      this.historicalData[i] = [];
    }

    this.historicalDataSubscription.unsubscribe();
    this.isHistoricalGraphOpen = false;

    for (let i = 0; i < this.device.labels?.length!; i++) {
      this.historicalChartOptions[i] = {
        ...this.historicalChartOptions[i],
        series: [
          {
            data: []
          }
        ]
      };
    }
  }

  private initRealTimeChartOptions() {
    for (let i = 0; i < this.device.labels?.length!; i++) {
      this.realTimeChartOptions[i] = {
        series: [
          {
            name: this.device.labels![i],
            data: this.realTimeData[i]
          }
        ],
        chart: {
          height: 350,
          type: "line",
          zoom: {
            enabled: false
          },
          animations: {
            enabled: false,
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: "straight"
        },
        title: {
          text: "Real Time " + this.device.labels![i],
          align: "left"
        },
        grid: {
          row: {
            colors: ["#f3f3f3", "transparent"],
            opacity: 0.5
          }
        },
        xaxis: {
          categories: this.realTimeXAxis
        }
      };
    }
  }

  private initHistoricalChartOptions() {
    for (let i = 0; i < this.device.labels?.length!; i++) {
      this.historicalChartOptions[i] = {
        series: [
          {
            name: this.device.labels![i],
            data: this.historicalData[i]
          }
        ],
        chart: {
          height: 350,
          type: "line",
          zoom: {
            enabled: false
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: "straight"
        },
        title: {
          text: "Historical " + this.device.labels![i],
          align: "left"
        },
        grid: {
          row: {
            colors: ["#f3f3f3", "transparent"],
            opacity: 0.5
          }
        },
        xaxis: {
          categories: this.historicalXAxis
        }
      };
    }
  }

  updateHistoricalChartOptions() {
    for (let j = 0; j < this.device.labels?.length!; j++) {
      this.historicalChartOptions[j] = {
        ...this.historicalChartOptions[j],
        series: [
          {
            name: this.device.labels![j],
            data: this.historicalData[j]
          }
        ],
        xaxis: {
          categories: this.historicalXAxis
        }
      }
    }
  }

  next10Items() {
    for (let j = 0; j < this.device.labels?.length!; j++) {
      this.historicalData[j] = [];
    }
    this.historicalXAxis = [];

    for (let i = this.currentHistoricalDataIndex; i < this.currentHistoricalDataIndex + 10; i++) {
      this.parseData(i);
    }
    this.currentHistoricalDataIndex += 10;

    this.updateHistoricalChartOptions();
  }

  downloadScript() {
    const labels = this.device.labels;
    let request: ScriptRequest = new ScriptRequest({
      api_key: this.device.connection_string,
      labels: labels
    });

    this.scriptService.generateScript(request).subscribe((responseBlob: Blob) => {
      const url = window.URL.createObjectURL(new Blob([responseBlob], { type: 'application/octet-stream' }));
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.style.display = 'none';
      a.href = url;
      a.download = 'generated_code.py';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  async downloadReport() {
    const result = await this.openModal();

    if (result !== false) {
      const r = result as HistoricalPeriod;
      let request: HistoricalReport = new HistoricalReport({
        dateFrom: r.dateFrom,
        dateTo: r.dateTo,
        deviceName: this.device.name,
        labels: this.device.labels
      })

      this.historicalReportSubscription = this.historicalService.fetchHistoricalReport(request).subscribe((responseBlob: Blob) => {
        const url = window.URL.createObjectURL(new Blob([responseBlob], { type: 'application/pdf' }));
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.style.display = 'none';
        a.href = url;
        a.download = 'report.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
      });
    }
  }
}
