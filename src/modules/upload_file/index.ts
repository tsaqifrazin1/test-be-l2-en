import { Module } from '@nestjs/common';
import { UploadFileServiceToken } from './interface/upload_file.interface';
import { UploadFileAzure } from './services/upload_file_azure.service';

@Module({
  imports: [],
  providers: [
    UploadFileAzure,
    {
      provide: UploadFileServiceToken,
      useClass: UploadFileAzure,
    },
  ],
  exports: [UploadFileAzure, UploadFileServiceToken],
})
export class UploadFileModule {}
