export class RouteConstants {
    public static API_BASE_ROUTE = 'api/';
    public static API_APP_VERSION = 'v1/';
    public static API_CMMS = 'cmms/';
    public static API_USER = 'user/';
    public static API_AUTH = 'auth/';
    public static API_ASSET = 'asset/';
    public static API_ROLE_PERMISSION = 'role-permission/';
    public static API_PERMISSION = 'permission/';
    public static API_TASK = 'task/';
    public static API_CHECKLIST = 'checklist/';
    public static API_NOTIFICATIONS = 'notifications/';
    public static API_SUPERVISOR = 'supervisor/';

    private static CMMS_API_ENDPOINT = this.API_BASE_ROUTE + this.API_APP_VERSION + this.API_CMMS;

    // POST /api/v1/cmms/auth/login
    public static API_LOGIN = this.CMMS_API_ENDPOINT + this.API_AUTH + 'login';

    // POST /api/v1/cmms/auth/register
    public static API_REGISTER_USER = this.CMMS_API_ENDPOINT + this.API_AUTH + 'register';

    // GET /api/v1/cmms/user 
    public static API_FETCH_ALL_USER = this.CMMS_API_ENDPOINT + this.API_USER;

    // GET /api/v1/cmms/user 
    public static API_FETCH_USER_BY_ID = this.CMMS_API_ENDPOINT + this.API_USER + ':id';

    // POST /api/v1/cmms/user 
    public static API_CREATE_USER = this.CMMS_API_ENDPOINT + this.API_USER;

    // PUT /api/v1/cmms/user/:id
    public static API_UPDATE_USER = this.CMMS_API_ENDPOINT + this.API_USER + ':id';

    // DELETE /api/v1/cmms/user/:id
    public static API_DELETE_USER = this.CMMS_API_ENDPOINT + this.API_USER + ':id';

    // PUT /api/v1/cmms/user/:id/reset-password
    public static API_RESET_PASSWORD = this.CMMS_API_ENDPOINT + this.API_USER + ':id' + '/reset-password';

    // DELETE /api/v1/cmms/users/supervisors/:supervisorId
    public static API_FETCH_USERS_BY_SUPERVISOR_ID = this.CMMS_API_ENDPOINT + this.API_USER + this.API_SUPERVISOR + ':supervisorId';

    // POST /api/v1/cmms/asset
    public static API_CREATE_ASSET = this.CMMS_API_ENDPOINT + this.API_ASSET;

    // GET /api/v1/cmms/asset
    public static API_FETCH_ASSET = this.CMMS_API_ENDPOINT + this.API_ASSET;

    // DELETE /api/v1/cmms/asset/:assetId
    public static API_DELETE_ASSET_BY_ID = this.CMMS_API_ENDPOINT + this.API_ASSET + ':assetId';

    // PUT /api/v1/cmms/asset/:assetId
    public static API_UPDATE_ASSET_BY_ID = this.CMMS_API_ENDPOINT + this.API_ASSET + ':assetId';

    // POST /api/v1/cmms/role-permission
    public static API_CREATE_ROLE_PERMISSION = this.CMMS_API_ENDPOINT + this.API_ROLE_PERMISSION;

    // GET /api/v1/cmms/role-permission
    public static API_GET_ROLE_PERMISSION = this.CMMS_API_ENDPOINT + this.API_ROLE_PERMISSION;

    // GET /api/v1/cmms/role-permission/:id
    public static API_GET_ROLE_PERMISSION_BY_ID = this.CMMS_API_ENDPOINT + this.API_ROLE_PERMISSION + ':id';

    // PUT /api/v1/cmms/role-permission/:id
    public static API_UPDATE_ROLE_PERMISSION = this.CMMS_API_ENDPOINT + this.API_ROLE_PERMISSION + ':id';

    // POST /api/v1/cmms/permission
    public static API_CREATE_PERMISSION = this.CMMS_API_ENDPOINT + this.API_PERMISSION;

    // GET /api/v1/cmms/permission
    public static API_GET_PERMISSION = this.CMMS_API_ENDPOINT + this.API_PERMISSION;

    // GET /api/v1/cmms/permission/:id
    public static API_GET_PERMISSION_BY_ID = this.CMMS_API_ENDPOINT + this.API_PERMISSION + ':id';

    // PUT /api/v1/cmms/permission/:id
    public static API_UPDATE_PERMISSION_BY_ID = this.CMMS_API_ENDPOINT + this.API_PERMISSION + ':id';

    // POST /api/v1/cmms/task
    public static API_CREATE_TASK = this.CMMS_API_ENDPOINT + this.API_TASK;

    // GET /api/v1/cmms/task/:id
    public static API_FETCH_TASK_BY_ID = this.CMMS_API_ENDPOINT + this.API_TASK + ':id';

    // GET /api/v1/cmms/task
    public static API_FETCH_TASK = this.CMMS_API_ENDPOINT + this.API_TASK;

    // GET /api/v1/cmms/task/status/summary
    public static API_FETCH_TASK_STATUS_SUMMARY = this.CMMS_API_ENDPOINT + this.API_TASK + 'status' + '/summary';

    // GET /api/v1/cmms/task/pending/approval;
    public static API_FETCH_PENDING_APPROVAL_TASK = this.CMMS_API_ENDPOINT + this.API_TASK + 'pending' + '/approval';

    // PUT /api/v1/cmms/task/:id
    public static API_UPDATE_TASK = this.CMMS_API_ENDPOINT + this.API_TASK + ':id';

    // PUT /api/v1/cmms/task/:id/approve
    public static API_APPROVE_TASK = this.CMMS_API_ENDPOINT + this.API_TASK + ':id' + '/approve';

    // PUT /api/v1/cmms/task/:id/assigned-to/assignedToId
    public static API_TASK_ASSIGNED_TO = this.CMMS_API_ENDPOINT + this.API_TASK + ':id' + '/assigned-to' + '/:assignedToId';

    // GET /api/v1/cmms/task/assigned-to/assignedToId
    public static API_FETCH_TASK_BY_ASSIGNED_TO_ID = this.CMMS_API_ENDPOINT + this.API_TASK + 'assigned-to' + '/:assignedToId';

    // PUT /api/v1/cmms/checklist/:id/task/:taskId
    public static API_UPDATE_CHEKLIST_BY_ID = this.CMMS_API_ENDPOINT + this.API_CHECKLIST + ':id/' + this.API_TASK + ':taskId';

    // GET /api/v1/cmms/notifications/user/:userId
    public static API_FECTH_NOTIFICATION_BY_USERID = this.CMMS_API_ENDPOINT + this.API_NOTIFICATIONS + this.API_USER + ':userId/';

    // PUT /api/v1/cmms/notifications/:id/read
    public static API_NOTIFICATION_MARKS_AS_READ = this.CMMS_API_ENDPOINT + this.API_NOTIFICATIONS + ':id/' + 'read';

    // POST /api/v1/cmms/task/upload-image
    public static API_UPLOAD_TASK_IMAGE = this.CMMS_API_ENDPOINT + this.API_TASK + 'upload-image';

    // POST /api/v1/cmms/task/delete-image
    public static API_DELETE_TASK_IMAGE = this.CMMS_API_ENDPOINT + this.API_TASK + 'delete-image';
}
