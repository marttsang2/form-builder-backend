import { Module } from '@nestjs/common';
import { FormResponsesService } from './form-responses.service';
import { FormResponsesController } from './form-responses.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FormResponsesController],
  providers: [FormResponsesService],
})
export class FormResponsesModule {}
