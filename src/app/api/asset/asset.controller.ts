import { Body, Controller, Delete, Get, Param, Post, Put, Query, Request } from '@nestjs/common';
import { RouteConstants } from '../constants/route-constants';
import { AssetService } from './asset.service';
import { AssetFilters, CreateAssetDto, UpdateAssetDto } from './dto/asset.dto';
import { Request as Req } from '../users/user.interface';
import { RequestParams } from '../constants/message-constants';

@Controller()
export class AssetController {

  constructor(
    public readonly assetService: AssetService
  ) { }

  @Post(RouteConstants.API_CREATE_ASSET)
  async createAsset(
    @Body() createAssetDto: CreateAssetDto,
    @Request() request: Req,
  ) {
    return this.assetService.createAsset(createAssetDto, request);
  }


  @Get(RouteConstants.API_FETCH_ASSET)
  async fetchAsset(
    @Query() assetFilters: AssetFilters
  ) {
    return this.assetService.fetchAsset(assetFilters);
  }

  @Delete(RouteConstants.API_DELETE_ASSET_BY_ID)
  async deleteAsset(
    @Param(RequestParams.ASSET_ID) assetId: string,
    @Request() request: Req
  ) {
    return this.assetService.deleteAsset(assetId, request);
  }

  @Put(RouteConstants.API_UPDATE_ASSET_BY_ID)
  async updateAsset(
    @Param(RequestParams.ASSET_ID) assetId: string,
    @Body() updateAssetDto: UpdateAssetDto,
    @Request() request: Req
  ) {
    return this.assetService.updateAsset(assetId, updateAssetDto, request);
  }
}