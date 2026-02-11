import { Module } from '@nestjs/common';
import { NormalizeService } from './normalize.service';
import { AzureStorageService } from './azure-storage.service';

@Module({
    providers: [NormalizeService, AzureStorageService],
    exports: [NormalizeService, AzureStorageService],
})
export class SharedModule { }
