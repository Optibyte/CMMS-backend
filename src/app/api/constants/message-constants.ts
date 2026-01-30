export const jwtConstants = {
  secret: 'secretKey',
};

export class DefaultConstant {
  public static POSTGRES = 'postgres';
  public static CMMS_CONNECTION = 'cmmsConnection';
  public static TO_DO = 0;
  public static PENDING_APPROVAL = 5
}
export class DatabaseNames {
  public static CMMS_DB = 'cmmsDb';
}

export class LogsLevelConstant {
  public static INFO = 'info';
  public static ERROR = 'error';
}

export class RequestParams {
  public static ID = 'id';
  public static ASSIGNED_TO = 'assignedToId';
  public static ASSET_ID = 'assetId';
  public static TASK_ID = 'taskId';
  public static USER_ID = 'userId';
  public static SUPERVISOR_ID = "supervisorId";
  public static OFFSET = "offset";
  public static LIMIT = "limit";
  public static ISREAD = "isRead";
}

export const FIELDS_CONSTANTS = {
  QR_CODE: 'qrCode',
  CREATED_BY: 'createdBy',
  UPDATED_BY: 'updatedBy',
  CREATED_AT: 'createdAt',
  UPDATED_AT: 'updatedAt',
  ASSIGNED_BY: 'assignedBy',
  APPROVED_BY: 'approvedBy',
  APPROVE_STATUS: 'approveStatus',
  APPROVED_DATE: 'approvedDate',
  STATUS: 'status',
  CODE: 'code',
  APPROVED_BY_REMARKS: 'approvedByRemarks',
  USERNAME: 'username',
  ID: 'id',
  ASSET: 'asset',
  CHECKLISTS: 'checklists'
};