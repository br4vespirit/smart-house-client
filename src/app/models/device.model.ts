export class Device {
  name?: string;
  description?: string;
  location?: string;
  hardware_model?: string

  constructor(partial: Partial<Device>) {
    Object.assign(this, partial);
  }
}
