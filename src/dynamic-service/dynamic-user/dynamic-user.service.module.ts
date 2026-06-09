import { Module } from '@nestjs/common';

import { ConfigRegisterModule } from 'src/utils/config-register/ConfigRegisterModule';


import { TypeOrmModule } from '@nestjs/typeorm';
import { DynamicSysUserRepository } from './repositories/dynamic.sys-user.repository';
import { DynamicUserService } from './dynamic-user.service';
import { createRepositoryProvider } from 'src/database/database.dynamic.module';
import { DynamicSysUserEntity } from './dynamic-user..entity';



@Module({
    imports: [],
    providers: [DynamicUserService, DynamicSysUserRepository, createRepositoryProvider(DynamicSysUserEntity)],
    exports: [DynamicUserService],
})
export class DynamicUserServiceModule { }