export class ScriptRequest {
  api_key?: string;
  labels?: string[];

  constructor(partial: Partial<ScriptRequest>) {
    Object.assign(this, partial);
  }
}
