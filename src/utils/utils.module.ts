import { DynamicModule, Global, Module } from "@nestjs/common";
import { ConfigRegisterModule } from "./config-register/ConfigRegisterModule";
import { YamlConfigService } from "./yaml-config-service";

const configRegisterModule = ConfigRegisterModule.register('/path/to/config');
const configRegisterModuleTow = ConfigRegisterModule.register('/path/to/config2222');

@Global()
@Module({
    imports: [configRegisterModule, configRegisterModuleTow],
    providers: [YamlConfigService],
    exports: [configRegisterModule, configRegisterModuleTow, YamlConfigService],
})
export class UtilsModule {

}