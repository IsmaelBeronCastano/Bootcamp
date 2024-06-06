"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
const config_1 = require("./config");
async function bootstrap() {
    const logger = new common_1.Logger('Payments-ms');
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        rawBody: true
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
    }));
    await app.listen(config_1.envs.port);
    logger.log(`Payments Microservice running on port ${config_1.envs.port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map