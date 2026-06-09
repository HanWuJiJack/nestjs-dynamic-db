import { Module } from '@nestjs/common';


import { TypeOrmModule } from '@nestjs/typeorm';
import { SysDbEntity } from './db.entity';
import { DbService } from './db.user.service';
import { SysDbRepository } from './repositories/sys-user.repository';

@Module({
    imports: [TypeOrmModule.forFeature([SysDbEntity]),],
    providers: [DbService, SysDbRepository],
    exports: [DbService],
})
export class DbServiceModule { }