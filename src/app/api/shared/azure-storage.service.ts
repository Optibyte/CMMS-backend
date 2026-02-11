import { Injectable } from '@nestjs/common';
import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AzureStorageService {
    private containerClient: ContainerClient;

    constructor(private configService: ConfigService) {
        console.error('🚀 🚀 🚀 AZURE STORAGE SERVICE INITIALIZING... 🚀 🚀 🚀');
        let azureConfig = this.configService.get<any>('azureStorage');
        console.error('DEBUG: azureConfig from ConfigService:', JSON.stringify(azureConfig));

        let connectionString = azureConfig?.connectionString;
        let containerName = azureConfig?.containerName;

        if (!connectionString) connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
        if (!containerName) containerName = process.env.AZURE_CONTAINER_NAME;

        console.error('DEBUG: Final Container:', containerName, 'HasConnString:', !!connectionString);

        if (connectionString && containerName) {
            try {
                const cleanConnString = connectionString.trim();
                const blobServiceClient = BlobServiceClient.fromConnectionString(cleanConnString);
                this.containerClient = blobServiceClient.getContainerClient(containerName);
                console.error('DEBUG: Azure Storage Client initialized successfully.');
            } catch (error) {
                console.error('DEBUG: Failed to initialize Azure Storage Client:', error.message);
            }
        } else {
            console.error('DEBUG: Azure Storage credentials missing. Conn exists:', !!connectionString, 'Cont exists:', !!containerName);
        }
    }

    async uploadFile(file: Express.Multer.File, folderPath?: string): Promise<string> {
        if (!this.containerClient) {
            throw new Error('Azure Storage not configured');
        }

        try {
            const fileName = `${uuidv4()}-${file.originalname}`;
            // Organize files into folders: technician-tasks/{fileName}
            const blobName = folderPath ? `${folderPath}/${fileName}` : fileName;
            const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);

            await blockBlobClient.uploadData(file.buffer, {
                blobHTTPHeaders: { blobContentType: file.mimetype },
            });

            console.log(`Azure Storage: Uploaded file to ${blobName}`);
            return blockBlobClient.url;
        } catch (error) {
            console.error('Azure Storage Upload Error:', error);
            throw error;
        }
    }

    async deleteFile(fileUrl: string): Promise<void> {
        if (!this.containerClient) {
            throw new Error('Azure Storage not configured');
        }

        try {
            // Extract blob name from URL (including folder path)
            // Example URL: https://account.blob.core.windows.net/container/technician-tasks/blob-name?sas-token
            const url = new URL(fileUrl);
            const pathParts = url.pathname.split('/');
            // Remove empty strings and container name, keep the rest as blob path
            const containerIndex = pathParts.findIndex(part => part === this.containerClient.containerName);
            const blobPath = pathParts.slice(containerIndex + 1).map(part => decodeURIComponent(part)).join('/');

            const blockBlobClient = this.containerClient.getBlockBlobClient(blobPath);
            await blockBlobClient.delete();
            console.log(`Azure Storage: Deleted file ${blobPath}`);
        } catch (error) {
            console.error('Azure Storage Delete Error:', error);
            throw error;
        }
    }
}
