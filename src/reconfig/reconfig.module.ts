import { Module } from "@nestjs/common";
import { ReconfigureService } from "./reconfig.service";
import { ReconfigureController } from "./reconfig.controller";

@Module({
    controllers: [ReconfigureController],
    providers: [ReconfigureService],
    exports: [ReconfigureService],
})
export class ReconfigureModule {}