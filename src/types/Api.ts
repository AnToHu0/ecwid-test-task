export interface ApiConfig {
  storeId: string;
  token: string;
  baseUrl: string;
}
 
export interface ApiRequestParams {
  [key: string]: string | number | boolean | undefined;
} 