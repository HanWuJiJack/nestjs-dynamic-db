import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('db')
export class SysDbEntity {
    @PrimaryGeneratedColumn('increment', {
        name: 'id',
        comment: 'id',
    })
    id!: number;

    /** 用户账号 */
    @Column({
        name: 'name',
        length: 30,
        unique: true,
        comment: '名字'
    })
    name!: string;

}