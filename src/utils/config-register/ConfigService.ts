// config.service.ts
import { Injectable, Inject } from '@nestjs/common';

@Injectable()
export class ConfigService {
    constructor(private readonly configPath: string) { }

   getPath(): string {
    return this.configPath;
  }
}