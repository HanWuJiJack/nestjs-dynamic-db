import { Injectable } from '@nestjs/common';
import { SysDbRepository } from './repositories/sys-user.repository';
import { SysDbEntity } from './db.entity';
import { YamlConfigService } from 'src/utils/yaml-config-service';
import { createDatabase, dropDatabase } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { readFileSync } from 'fs';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class DbService {
  constructor(
    private readonly sysDbRepository: SysDbRepository,
    private readonly yamlConfigService: YamlConfigService,
    private eventEmitter: EventEmitter2,
  ) { }

  getDbList(): Promise<SysDbEntity[]> {
    return this.sysDbRepository.selectDbList(new SysDbEntity());
  }

  async createDb(database: string): Promise<SysDbEntity[]> {
    const dbConfig = this.yamlConfigService.getDatabaseConfig();
    const filePath = process.cwd() + '/src/resources/init.sql';
    const options = {
      type: dbConfig.datasource.master.type,
      host: dbConfig.datasource.master.host,
      port: dbConfig.datasource.master.port,
      username: dbConfig.datasource.master.username,
      password: dbConfig.datasource.master.password,
      database: database,
    };
    await createDatabase({ options });
    // 创建成功后，再初始化 DataSource 来连接并操作其他表结构
    const dataSource = new DataSource(options);
    await dataSource.initialize();
    const queryRunner = dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      const sql = readFileSync(filePath, 'utf8');
      // 按 ";" 分割 SQL 语句，注意需谨慎处理文件内容避免分割错误
      const queries = sql.split(';').filter(query => query.trim());
      for (let query of queries) {
        if (query) {
          await queryRunner.query(query);
        }
      }
      // // console.log(`SQL file ${filePath} executed successfully.`);
    } catch (err) {
      console.error(`Error executing SQL file: ${err}`);
    } finally {
      await queryRunner.release();
      await dataSource.destroy();
    }
    this.eventEmitter.emit('db.created', {
      dbname: database,
    });
    await this.sysDbRepository.createDb({ name: database } as SysDbEntity);
    return this.sysDbRepository.selectDbList(new SysDbEntity());
  }
}
