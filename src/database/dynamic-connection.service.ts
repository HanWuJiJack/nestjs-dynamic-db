// src/database/dynamic-connection.service.ts
import { Injectable } from '@nestjs/common';
import { DataSource, DataSourceOptions, EntityTarget, ObjectLiteral, Repository } from 'typeorm';
import { ModuleRef } from '@nestjs/core'; // 用于动态注入Entity，非必须，但推荐

@Injectable()
export class DynamicConnectionService {
    // 存储所有活跃的连接实例: Map<数据库标识, { dataSource, lastUsedTime, timer? }>
    private connections: Map<string, {
        dataSource: DataSource;
        lastUsedTime: number;
        timer?: NodeJS.Timeout;
    }> = new Map();

    private connectionsOptions: Map<string, DataSourceOptions> = new Map();

    // 默认的空闲超时时间：30分钟 = 1800000毫秒
    private readonly DEFAULT_IDLE_TIMEOUT = 30 * 60 * 1000;
    // private readonly DEFAULT_IDLE_TIMEOUT = 20 * 1000;
    constructor(private moduleRef: ModuleRef) { }

    /**
     * 获取或创建一个数据库连接
     * @param dbName 数据库标识（如 'db_tenant_001'）
     * @param options 连接配置
     */
    async getConnection(dbName: string, options: DataSourceOptions): Promise<DataSource> {
        const existing = this.connections.get(dbName);
        if (existing) {
            // 更新最后使用时间，并清除原有的定时器
            existing.lastUsedTime = Date.now();
            if (existing.timer) {
                clearTimeout(existing.timer);
                existing.timer = undefined;
            }
            return existing.dataSource;
        }
        const extendedOptions = {
            ...options,
            extra: {
                ...options.extra,
                // 30分钟 = 1800000毫秒，让驱动在连接空闲时也主动断开
                // idleTimeoutMillis: 1800000,
                // 启用 keepAlive 防止意外断开
                enableKeepAlive: true,
            },
        };
        // 若连接不存在，则创建新的
        const dataSource = await this.createDataSource(extendedOptions);
        this.connections.set(dbName, {
            dataSource,
            lastUsedTime: Date.now(),
        });
        this.connectionsOptions.set(dbName, extendedOptions);
        console.log(`✅ 成功为数据库 [${dbName}] 建立连接`);
        this.scheduleIdleDisconnect(dbName);
        return dataSource;
    }


    /**
  * 获取或创建一个数据库连接
  * @param dbName 数据库标识（如 'db_tenant_001'）
  * @param options 连接配置
  */
    async getLocalConnection(dbName: string): Promise<DataSource> {
        const existing = this.connections.get(dbName);
        if (existing) {
            // 更新最后使用时间，并清除原有的定时器
            existing.lastUsedTime = Date.now();
            if (existing.timer) {
                clearTimeout(existing.timer);
                existing.timer = undefined;
            }
            return existing.dataSource;
        }
        const options = this.connectionsOptions.get(dbName);
        if (!options) {
            throw new Error(`没有找到数据库 [${dbName}] 的连接配置`);
        }
        // 若连接不存在，则创建新的
        const dataSource = await this.createDataSource(options);
        this.connections.set(dbName, {
            dataSource,
            lastUsedTime: Date.now(),
        });
        this.scheduleIdleDisconnect(dbName);
        return dataSource;
    }

    /**
     * 获取某个数据库的 Repository
     * @param dbName 数据库标识（库名或租户ID）
     * @param entity TypeORM 实体类
     */
    async getRepository<T extends ObjectLiteral>(
        dbName: string,
        entity: EntityTarget<T>,
    ): Promise<Repository<T>> {
        const connection = await this.getLocalConnection(dbName);
        return connection.getRepository(entity);
    }

    /**
     * 创建新的 DataSource 实例
     */
    private async createDataSource(options: DataSourceOptions): Promise<DataSource> {
        const dataSource = new DataSource(options);
        await dataSource.initialize();
        return dataSource;
    }

    /**
     * 手动销毁一个连接，并清理所有关联的Entity
     */
    async destroyConnection(dbName: string): Promise<void> {
        const conn = this.connections.get(dbName);
        if (conn) {
            if (conn.timer) clearTimeout(conn.timer);
            if (conn.dataSource.isInitialized) {
                await conn.dataSource.destroy();
                console.log(`🛑 已销毁数据库连接：[${dbName}]`);
            }
            this.connections.delete(dbName);
        }
    }

    /**
     * 核心回收逻辑：为指定连接安排回收任务
     * @param dbName 数据库标识
     * @param idleTimeoutMs 自定义超时时间 (可选)
     */
    scheduleIdleDisconnect(dbName: string, idleTimeoutMs: number = this.DEFAULT_IDLE_TIMEOUT) {
        const conn = this.connections.get(dbName);
        if (!conn) return;

        // 如果已经有定时器，先清除再重置，避免重复
        if (conn.timer) clearTimeout(conn.timer);

        conn.timer = setTimeout(async () => {
            // 超时后，检查该连接是否真的超过了30分钟未被使用
            if (Date.now() - conn.lastUsedTime >= idleTimeoutMs) {
                console.log(`⏳ 数据库 [${dbName}] 空闲超过 ${idleTimeoutMs / 1000}s，准备回收...`);
                await this.destroyConnection(dbName);
            }
        }, idleTimeoutMs);

        // 确保timer在node事件循环中不会阻止进程退出（优雅退出）
        conn.timer.unref();
    }

    // （可选）在应用关闭时，统一清理所有连接
    async onModuleDestroy() {
        for (const [dbName] of this.connections) {
            await this.destroyConnection(dbName);
        }
    }
}