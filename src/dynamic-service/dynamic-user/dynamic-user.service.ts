import { Injectable } from '@nestjs/common';
import { DynamicSysUserRepository } from './repositories/dynamic.sys-user.repository';
import { DynamicSysUserEntity } from './dynamic-user..entity';


@Injectable()
export class DynamicUserService {
  constructor(
    private readonly dynamicSysUserRepository: DynamicSysUserRepository,
  ) { }
  getDynamicSysUserEntityList(): Promise<DynamicSysUserEntity[]> {
    return this.dynamicSysUserRepository.selectUserList(new DynamicSysUserEntity());
  }
}
