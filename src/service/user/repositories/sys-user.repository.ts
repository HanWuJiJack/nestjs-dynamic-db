import { Injectable } from '@nestjs/common';
import { Repository, DataSource, SelectQueryBuilder, EntityManager } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SysUser } from '../user.entity';


@Injectable()
export class SysUserRepository {

    constructor(
        @InjectRepository(SysUser)
        private readonly userRepository: Repository<SysUser>,

    ) { }



    selectUserVo() {
        return this.userRepository
            .createQueryBuilder('u')
            .leftJoinAndMapOne('u.dept', 'sys_dept', 'd', 'u.dept_id = d.dept_id')
            .leftJoin('sys_user_role', 'ur', 'u.user_id = ur.user_id')
            .leftJoinAndMapMany('u.roles', 'sys_role', 'r', 'r.role_id = ur.role_id')
            .select([
                // 用户字段
                'u.userId',

                'u.userName',
                'u.nickName',
            ])
    }

    /**
     * 根据条件分页查询用户列表
     */
    async selectUserList(query: SysUser): Promise<SysUser[]> {
        return this.userRepository.find();
    }




}
