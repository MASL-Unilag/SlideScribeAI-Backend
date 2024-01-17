import { ContainerClient } from "@azure/storage-blob";

export class FileUploadManager {
  constructor(private readonly uploadClient: ContainerClient) {}

  upload = async (bufferContents: ArrayBuffer, fileName: string) => {
    const blockBlobClient = this.uploadClient.getBlockBlobClient(
      `${fileName}.pptx`,
    );
    await blockBlobClient.uploadData(bufferContents);
    return blockBlobClient.url;
  };
}
