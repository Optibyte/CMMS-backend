import * as path from 'path';
import { DefaultConstant } from 'src/app/api/constants/message-constants';

const fs = require('fs');
let configPath = path.join(process.cwd(), `env/config.json`)
if (process.argv?.[2]) {
    configPath = process.argv?.[2];
};
const configRawdata = fs.readFileSync(configPath);
let configFile = JSON.parse(configRawdata);
console.log(`loading config from ${configPath} `);


export default () => ({
    port: parseInt(configFile?.port, 10) || 3000,
    cmmsDb: {
        name: DefaultConstant.CMMS_CONNECTION,
        type: DefaultConstant.POSTGRES,
        host: configFile?.defaultDataSource?.host,
        username: configFile?.defaultDataSource?.username,
        password: configFile?.defaultDataSource?.password,
        database: configFile?.defaultDataSource?.database,
        port: parseInt(configFile?.defaultDataSource?.port),
        logging: configFile?.defaultDataSource?.logging === true,
        entities: (configFile?.defaultDataSource?.entities ? configFile?.defaultDataSource?.entities : "dist/cmms_db/**/*.entity.ts").split(','),
        migrationsRun: configFile?.defaultDataSource?.migrationsRun === true,
        synchronize: configFile?.defaultDataSource?.synchronize === true,
        ssl: configFile?.defaultDataSource?.ssl || false
    },
    redisHost: configFile?.redisConfig?.redisHost,
    redisPort: configFile?.redisConfig?.redisPort,
    cacheTtl: configFile?.redisConfig?.cacheTtl,
    maxItemInCache: configFile?.redisConfig?.maxItemInCache,
    jwtSecret: configFile?.jwtSecret,
    jwtTokenExpire: configFile?.jwtTokenExpire,
    logPath: configFile?.logPath,
    azureStorage: {
        containerName: process.env.AZURE_CONTAINER_NAME || configFile?.azureStorage?.containerName,
        connectionString: process.env.AZURE_STORAGE_CONNECTION_STRING || configFile?.azureStorage?.connectionString
    }
})
