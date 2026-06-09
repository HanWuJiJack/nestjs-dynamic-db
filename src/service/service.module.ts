import { Module } from '@nestjs/common';

import { UserServiceModule } from './user/service.module';
import { DbServiceModule } from './db/db.service.module';



@Module({
    imports: [UserServiceModule, DbServiceModule],
    providers: [],
    exports: [UserServiceModule, DbServiceModule],
})
export class ServiceModule { }