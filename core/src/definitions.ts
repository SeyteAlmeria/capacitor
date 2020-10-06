import { PluginRegistry } from './core-plugin-definitions';

export interface Plugin {
  addListener(
    eventName: string,
    listenerFunc: (...args: any[]) => any,
  ): PluginListenerHandle;
  checkPermissions?: () => Promise<PermissionResults>;
  shouldShowRequestPermissionRationale?: () => Promise<
    PermissionRationaleResults
  >;
  requestPermissions?: () => Promise<
    PermissionResults | LegacyPermissionResults
  >;
}

export interface LegacyPermissionResults {
  results: any[];
}

export interface PermissionResults {
  [key: string]: PermissionResult;
}

/**
 * Android only: checks if a rationale should be shown for the permission.
 */
export interface PermissionRationaleResults {
  [key: string]: boolean;
}

/**
 * Android only uses granted and denied.
 */
export type PermissionResult = 'granted' | 'denied';

export interface PluginListenerHandle {
  remove: () => void;
}

export interface PluginResultData {
  [key: string]: any;
}

export interface PluginResultError {
  message: string;
}

export type PluginCallback = (
  error: PluginResultError,
  data: PluginResultData,
) => void;

/**
 * Data sent over to native
 */
export interface PluginCall {
  callbackId: string;
  pluginId: string;
  methodName: string;
  options: any;
}

/**
 * Callback data kept on the client
 * to be called after native response
 */
export interface StoredCallback {
  callback?: PluginCallback;
  resolve?: (...args: any[]) => any;
  reject?: (...args: any[]) => any;
}

/**
 * Collection of all the callback data
 */
export interface StoredCallbacks {
  [callbackId: string]: StoredCallback;
}

/**
 * A resulting call back from the native layer.
 */
export interface PluginResult {
  callbackId?: string;
  methodName: string;
  data: PluginResultData;
  success: boolean;
  error?: PluginResultError;
}

export interface PluginConfig {
  id: string;
  name: string;
}

export interface Capacitor {
  isNative?: boolean;
  platform?: string;
  isPluginAvailable: (name: string) => boolean;
  convertFileSrc: (filePath: string) => string;
  getPlatform: () => string;
  toNative?: (
    pluginId: string,
    methodName: string,
    options: any,
    storedCallback?: StoredCallback,
  ) => void;
  fromNative?: (result: PluginResult) => void;
  withPlugin?: (pluginId: string, fn: (...args: any[]) => any) => void;
  nativeCallback?: (
    pluginId: string,
    methodName: string,
    options?: any,
    callback?: any,
  ) => void;
  nativePromise?: (
    pluginId: string,
    methodName: string,
    options?: any,
  ) => Promise<any>;
  handleError?: (error: Error) => void;
  handleWindowError?: (
    msg: string,
    url: string,
    lineNo: number,
    columnNo: number,
    error: Error,
  ) => void;
  Plugins?: PluginRegistry;
}

export interface WindowCapacitor {
  capacitor: Capacitor;
  androidBridge: {
    postMessage: (data: any) => void;
  };
  webkit: {
    messageHandlers: {
      bridge: {
        postMessage: (data: any) => void;
      };
    };
  };
  console: {
    [level: string]: (...args: any[]) => any;
  };
  window: any;
}

export { PluginRegistry };
