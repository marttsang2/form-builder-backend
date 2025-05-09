import { Module } from '@nestjs/common';
import { FormsService } from '@/forms/forms.service';
import { FormsController } from '@/forms/forms.controller';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FormsController],
  providers: [FormsService],
})
export class FormsModule {}
