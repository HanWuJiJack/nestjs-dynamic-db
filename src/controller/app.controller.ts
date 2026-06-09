import { Controller, Get, Inject, Param } from '@nestjs/common';

import { ConfigService } from 'src/utils/config-register/ConfigService';
import { DynamicUserService } from 'src/dynamic-service/dynamic-user/dynamic-user.service';
import { DynamicSysUserEntity } from 'src/dynamic-service/dynamic-user/dynamic-user..entity';
import { UserService } from 'src/service/user/user.service';
import { DbService } from 'src/service/db/db.user.service';
import { BaseController } from './base-controller';
import { Loggable } from 'src/decorators/loggable';



@Controller()
export class AppController extends BaseController {

  constructor(
    private readonly userService: UserService,
    private readonly dynamicUserService: DynamicUserService,
    private readonly dbService: DbService,
    // private readonly configService: ConfigService,
    @Inject('CONFIG_SERVICE_/path/to/config') private config1: ConfigService,
    @Inject('CONFIG_SERVICE_/path/to/config2222') private config2: ConfigService,
  ) {
    super();
  }

  @Get()
  getHello(): string {
    console.log(this.config1.getPath()); // 这里可以使用 ConfigService 来获取配置路径
    return this.userService.getHello();
  }

  @Get("v2")
  @Loggable('获取用户信息')
  getHello2(): Promise<DynamicSysUserEntity[]> {
    return this.dynamicUserService.getDynamicSysUserEntityList();
  }

  @Get("v3/:dbname")
  getHello3(@Param('dbname') dbname: string) {
    this.dbService.createDb(dbname);
    return this.success({
      data: null,
      msg: `Database ${dbname} creation initiated.`,
      code: 200
    });
  }
}
