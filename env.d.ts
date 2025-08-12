/// <reference types="vite/client" />
import 'axios'

// 声明合并 一次性扩展类型
declare module 'axios' {
  export interface AxiosRequestConfig {
    requestType?: string;
  }
}
