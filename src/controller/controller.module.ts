import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ServiceModule } from 'src/service/service.module';
import { DynamicServiceModule } from 'src/dynamic-service/dynamic-user.service.module';

@Module({
    imports: [ServiceModule, DynamicServiceModule],
    controllers: [AppController],
    providers: [],
    // exports: [ServiceModule, ServiceModule2],
})
export class ControllerModule { }