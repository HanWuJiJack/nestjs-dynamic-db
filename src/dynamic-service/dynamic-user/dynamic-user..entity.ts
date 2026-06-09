import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('sys_user')
export class DynamicSysUserEntity {
    @PrimaryGeneratedColumn('increment', {
        name: 'user_id',
        comment: '用户ID',
    })
    userId?: number;

    /** 用户账号 */
    @Column({
        name: 'user_name',
        length: 30,
        unique: true,
        comment: '用户账号'
    })
    userName?: string;

}