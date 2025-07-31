import { Module } from '@nestjs/common';
import { MailService } from './mail.service';

@Module({
  providers: [MailService],
  exports: [MailService], // ¡Importante! Esto permite que otros módulos usen MailService
})
export class MailModule {}
