export interface UploadResult {
  key: string;
  url: string;
}

export interface IStorageService {
  upload(key: string, buffer: Buffer, mimeType: string): Promise<UploadResult>;
  getSignedUrl(key: string, expiresInSeconds?: number): Promise<string>;
  delete(key: string): Promise<void>;
}
