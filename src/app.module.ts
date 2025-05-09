import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FormsModule } from './forms/forms.module';
import { FormResponsesModule } from './form-responses/form-responses.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [FormsModule, FormResponsesModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
