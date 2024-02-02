import { BlobServiceClient } from "@azure/storage-blob";
import { config } from "../../../../core";

const blobServiceClient = BlobServiceClient.fromConnectionString(
  config.azure.fileStorage.connectionString,
);
export const containerClient = blobServiceClient.getContainerClient(
  config.azure.fileStorage.containerName,
);
