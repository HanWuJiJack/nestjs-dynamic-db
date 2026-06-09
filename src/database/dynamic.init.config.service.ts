// src/config/dynamic-init-config.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { readFile } from 'fs/promises';
import * as yaml from 'js-yaml';
import { join } from 'path';
import { DynamicConnectionService } from './dynamic-connection.service';
import { DataSource, DataSourceOptions, EntityTarget, ObjectLiteral, Repository } from 'typeorm';
import { YamlConfigService } from 'src/utils/yaml-config-service';
import { DynamicSysUserEntity } from 'src/dynamic-service/dynamic-user/dynamic-user..entity';
import { DbService } from 'src/service/db/db.user.service';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class DynamicInitConfigService implements OnModuleInit {

  constructor(
    private readonly dynamicConnectionService: DynamicConnectionService,
    private readonly yamlConfigService: YamlConfigService,
    private readonly dbService: DbService,
  ) { }

  getDatabaseConfig(dbName: string): DataSourceOptions {
    const dbConfig = this.yamlConfigService.getDatabaseConfig();
    // console.log('Loaded DB Config:', dbConfig); // 输出加载的数据库配置，便于调试
    return {
      type: dbConfig.datasource.master.type,
      host: dbConfig.datasource.master.host,
      port: dbConfig.datasource.master.port,
      username: dbConfig.datasource.master.username,
      password: dbConfig.datasource.master.password,
      database: dbName,
      entities: [DynamicSysUserEntity],
      synchronize: dbConfig.datasource.master.synchronize,
      charset: dbConfig.datasource.master.charset,
      timezone: dbConfig.datasource.master.timezone,
      multipleStatements: dbConfig.datasource.master.multipleStatements,
      extra: {
        connectionLimit: dbConfig.datasource.master.pool.connectionLimit,     // 最大连接数
        waitForConnections: dbConfig.datasource.master.pool.waitForConnections,
        queueLimit: dbConfig.datasource.master.pool.queueLimit,
        connectTimeout: dbConfig.datasource.master.pool.connectTimeout,
      },
    };
  }

  @OnEvent('db.created')
  handleOrderCreatedEvent(payload: { dbname: string; }) {
    // 处理事件，例如发送通知、更新数据
    // console.log(`收到新数据库创建通知，数据库名: ${payload.dbname}`);
    this.dynamicConnectionService.getConnection(payload.dbname, this.getDatabaseConfig(payload.dbname));
  }

  async onModuleInit() {
    const dbList = await this.dbService.getDbList();
    // console.log('Database List:', dbList); // 输出数据库列表，便于调试
    dbList.forEach(db => {
      // console.log(`Initializing connection for DB: ${db.name}`);
      this.dynamicConnectionService.getConnection(db.name, this.getDatabaseConfig(db.name));
    });
    // this.dynamicConnectionService.getConnection("db1", this.getDatabaseConfig("db1"));
    // this.dynamicConnectionService.getConnection("db2", this.getDatabaseConfig("db2"));
  }
}