import { Injectable } from '@nestjs/common';
import { Repository, DataSource, SelectQueryBuilder, EntityManager } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SysDbEntity } from '../db.entity';



@Injectable()
export class SysDbRepository {

    constructor(
        @InjectRepository(SysDbEntity)
        private readonly DbRepository: Repository<SysDbEntity>,

    ) { }




    /**
     * 根据条件分页查询用户列表
     */
    async selectDbList(query: SysDbEntity): Promise<SysDbEntity[]> {
        return this.DbRepository.find();
    }


    async createDb(query: SysDbEntity): Promise<SysDbEntity> {
        return this.DbRepository.save(query);
    }




}
