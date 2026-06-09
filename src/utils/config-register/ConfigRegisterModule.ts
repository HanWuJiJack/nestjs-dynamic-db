import { DynamicModule, Module } from "@nestjs/common";
import { ConfigService } from "./ConfigService";

@Module({})
export class ConfigRegisterModule {
    static register(folderPath: string): DynamicModule {
        return {
            module: ConfigRegisterModule,
            providers: [
                {
                    provide: `CONFIG_SERVICE_${folderPath}`,
                    useValue: new ConfigService(folderPath),
                },
            ],
            exports: [
                {
                    provide: `CONFIG_SERVICE_${folderPath}`,
                    useValue: new ConfigService(folderPath),
                },
            ],
        };
    }
}