import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';

@Injectable()
export class YamlConfigService {
  private config: any;

  constructor() {
    const filePath = join(process.cwd(), 'src/resources', 'application-druid.yml');
    const fileContent = readFileSync(filePath, 'utf8');
    this.config = yaml.load(fileContent) as any;
  }

  getDatabaseConfig() {
    // console.log('Loaded DB Config:', this.config); // 输出加载的数据库配置，便于调试
    return this.config;
  }
}