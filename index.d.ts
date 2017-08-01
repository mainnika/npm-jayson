import { EventEmitter } from 'events';

export interface ClientOptions {
  reviver?: Function;
  replacer?: Function;
  version?: number;
  generator?: Function;
  encoding?: string;
}

export interface ServerOptions {
  reviver?: Function;
  replacer?: Function;
  router?: Function;
  collect?: boolean;
  params?: any;
  version?: number;
  encoding?: string;
}

export interface MethodOptions<T, R> {
  handler?: MethodHandler<T, R>;
  collect?: boolean;
  params?: any;
}

export interface JsonRpcMessage {
  id: string | number | null;
  version: number;
}

export interface JsonRpcMessageRequest<T = any> extends JsonRpcMessage {
  params?: T;
  method?: string;
}

export interface JsonRpcMessageResponse<T = any> extends JsonRpcMessage {
  result?: T;
  error?: JsonRpcError;
}

export interface JsonRpcError<T = any> {
  code: number;
  message: string;
  data?: T;
}

export type ResponseCallback<T> = (err?: {}, response?: JsonRpcMessageResponse<T>) => void;
export type ResponseCallbackBatch = (err: {} | undefined, responses: JsonRpcMessageResponse[]) => void;
export type ResponseCallbackSplitted<T> = (err?: {}, responseErr?: JsonRpcError, responseResult?: T) => void;
export type ResponseCallbackSplittedBatch = (err: {} | undefined, errorResponces: JsonRpcMessageResponse[], successResponces: JsonRpcMessageResponse[]) => void;

export class Client extends EventEmitter {
  constructor(server?: Server, options?: ClientOptions);
  constructor(options?: ClientOptions);

  request<T, R>(method: string, params?: T, callback?: ResponseCallback<R>): JsonRpcMessageRequest<T>;
  request<T, R>(method: string, params?: T, callback?: ResponseCallbackSplitted<R>): JsonRpcMessageRequest<T>;
  request<T, R>(method: string, params?: T, id?: string | number | null, callback?: ResponseCallback<R>): JsonRpcMessageRequest<T>;
  request<T, R>(method: string, params?: T, id?: string | number | null, callback?: ResponseCallbackSplitted<R>): JsonRpcMessageRequest<T>;

  request<T, R>(method: JsonRpcMessageRequest<T>, callback?: ResponseCallback<R>): JsonRpcMessageRequest<T>;
  request<T, R>(method: JsonRpcMessageRequest<T>, callback?: ResponseCallbackSplitted<R>): JsonRpcMessageRequest<T>;
  request<T, R>(method: JsonRpcMessageRequest<T>, id?: string | number | null, callback?: ResponseCallback<R>): JsonRpcMessageRequest<T>;
  request<T, R>(method: JsonRpcMessageRequest<T>, id?: string | number | null, callback?: ResponseCallbackSplitted<R>): JsonRpcMessageRequest<T>;

  request(method: JsonRpcMessageRequest[], callback?: ResponseCallbackBatch): JsonRpcMessageRequest;
  request(method: JsonRpcMessageRequest[], callback?: ResponseCallbackSplittedBatch): JsonRpcMessageRequest;
}

export type MethodCallback<R> = (err: {} | undefined, response: R) => void;
export type MethodHandler<T = any, R = any> = (request: T, callback: MethodCallback<R>) => void;

export class Server extends EventEmitter {
  constructor(methods?: Methods, options?: ServerOptions);

  method<T, R>(name: string, definition: MethodHandler<T, R>): void;
  method<T, R>(name: string, definition: Method<T, R>): void;
  method(name: string, definition: Client): void;

  methods(methods?: Methods): void;
  hasMethod(name: string): boolean;
  removeMethod(name: string): void;
  getMethod(name: string): Method;

  error<T>(code?: number, message?: string, data?: T): JsonRpcError<T>;

  call<T, R>(request: JsonRpcMessageRequest<T>, callback?: (err?: JsonRpcError, response?: JsonRpcMessageResponse<R>) => void): void;
  call(requests: JsonRpcMessageRequest[], callback?: (err: null, responses: JsonRpcMessageResponse[]) => void): void;
  call<R>(request: string, callback?: (err?: JsonRpcError, response?: JsonRpcMessageResponse<R>) => void): void;
}

export class Method<T = any, R = any> {
  constructor(handler: MethodHandler<T, R>, options?: MethodOptions<T, R>);
  constructor(options?: MethodOptions<T, R>);

  getHandler(): MethodHandler<T, R>;

  execute(server: Server, params?: T, callback?: MethodCallback<R>): void;
}

interface Methods {
  [name: string]: MethodHandler;
}

export namespace Utils {
  export namespace JSON {
    interface StringifyOptions {
      replacer?: Function;
    }

    interface StringifyCallback {
      (err: any, str: string): void;
    }

    interface ParseOptions {
      reviver?: Function;
    }

    interface ParseCallback {
      (err: any, obj: Object): void;
    }

    export function stringify(obj: any, options: StringifyOptions, callback: StringifyCallback): void;
    export function parse(str: string, options: ParseOptions, callback: ParseCallback): void;
  }
}
