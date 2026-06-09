import { Module } from '@nestjs/common';

import { DynamicUserServiceModule } from './dynamic-user/dynamic-user.service.module';



@Module({
    imports: [DynamicUserServiceModule],
    providers: [],
    exports: [DynamicUserServiceModule],
})
export class DynamicServiceModule { }