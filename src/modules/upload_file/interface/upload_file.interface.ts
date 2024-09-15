export interface IUploadFileService {
  uploadFile(
    file: Express.Multer.File,
    userId: number,
    options?: { containerName: string },
  ): Promise<string>;
}

export const UploadFileServiceToken = Symbol('UploadFileServiceToken');
