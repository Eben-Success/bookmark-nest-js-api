import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config"; // Add this import
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module"; // Add this import



@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    AuthModule,
    PrismaModule
  ],
})

export class AppModule {}