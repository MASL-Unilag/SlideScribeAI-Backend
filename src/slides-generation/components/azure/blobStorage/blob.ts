import { BlobServiceClient } from "@azure/storage-blob";
import { config } from "../../../../core";

const blobServiceClient = BlobServiceClient.fromConnectionString(
  config.fileStorage.connectionString,
);
export const containerClient = blobServiceClient.getContainerClient(
  config.fileStorage.containerName,
);
