import 'sst/node/config';

declare module 'sst/node/config' {
  export interface ConfigTypes {
    API_ENDPOINT: string;
    TABLE_NAME: string;
  }
}
