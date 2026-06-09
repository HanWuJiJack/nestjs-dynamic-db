import { Module } from '@nestjs/common';

import { ConfigRegisterModule } from 'src/utils/config-register/ConfigRegisterModule';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SysUser } from './user.entity';
import { SysUserRepository } from './repositories/sys-user.repository';



@Module({
    imports: [TypeOrmModule.forFeature([SysUser]),],
    providers: [UserService, SysUserRepository],
    exports: [UserService],
})
export class UserServiceModule { }