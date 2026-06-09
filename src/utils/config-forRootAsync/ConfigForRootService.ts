// config.service.ts
import { Injectable, Inject } from '@nestjs/common';

@Injectable()
export class ConfigForRootService {

  constructor(
    private readonly configPath: string,
  ) { }
  async onModuleInit() {

  }
  getPath(): string {
    return this.configPath;
  }
}