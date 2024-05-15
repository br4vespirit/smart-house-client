export class Device {
  name?: string;
  description?: string;
  location?: string;
  hardware_model?: string;
  labels?: string[];
  connection_string?: string;

  constructor(partial: Partial<Device>) {
    Object.assign(this, partial);
  }
}

