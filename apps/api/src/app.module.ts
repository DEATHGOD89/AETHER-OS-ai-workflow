import { Module } from "@nestjs/common";
import { ThrottlerModule, ThrottlerGuard } from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";
import { ChatModule } from "./chat/chat.module";
import { GenerationModule } from "./generation/generation.module";

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute window
        limit: 60, // 60 requests max per minute
      },
      {
        name: "burst",
        ttl: 10000, // 10 second window
        limit: 10, // 10 requests max burst
      },
    ]),
    ChatModule,
    GenerationModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
