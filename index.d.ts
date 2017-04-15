import { EventEmitter } from 'events';
import { Url } from 'url';

import {
	RequestOptions as NodeHttpsRequestOptions,
	Server as NodeHttpsServer,
	ServerOptions as NodeHttpsServerOptions
} from 'https';

import {
	RequestOptions as NodeHttpRequestOptions,
	Server as NodeHttpServer
} from 'http';

import {
	Server as NodeTcpServer
} from 'net';

import {
	TlsOptions,
	Server as NodeTlsServer
} from 'tls';

interface ClientOptions {
	reviver?: Function;
	replacer?: Function;
	version?: number;
	generator?: Function;
	encoding?: string;
}

interface ServerOptions {
	reviver?: Function;
	replacer?: Function;
	router?: Function;
	collect?: boolean;
	params?: any;
	version?: number;
	encoding?: string;
}

interface MiddlewareOptions {
	end: boolean;
}

interface ServerTcpOptions {
	allowHalfOpen?: boolean;
	pauseOnConnect?: boolean;
}

interface MethodOptions {
	handler?: Function;
	collect?: boolean;
	params?: any;
}

interface JsonRpcMessage {
	id?: any;
	result?: any;
	error?: any;
	params?: any;
	method?: string;
	version: number;
}

interface JsonRpcError {
	code: number;
	message: any;
	data?: any;
}

export class Client extends EventEmitter {
	constructor(server?: Server, options?: ClientOptions);
	constructor(options?: ClientOptions);

	request(method: string, params: any, id?: any, callback?: Function): void;
	request(method: string, params: any, callback?: Function): void;
	request(method: Array<any>, params: any, id?: any, callback?: Function): void;
	request(method: Array<any>, params: any, callback?: Function): void;
	request(method: Array<any>, callback?: Function): void;

	static http(url: string): ClientHttp;
	static http(options: ClientHttpOptions): ClientHttp;

	static https(url: string): ClientHttps;
	static https(options: ClientHttpsOptions): ClientHttps;

	static tcp(url: string): ClientTcp;
	static tcp(options: ClientOptions): ClientTcp;

	static tls(url: string): ClientTls;
	static tls(options: ClientTlsOptions): ClientTls;
}

export class Server extends EventEmitter {
	constructor(methods?: Methods, options?: ServerOptions);

	method(name: string, definition: Function): void;
	method(name: string, definition: Client): void;
	method(name: string, definition: Method): void;

	methods(methods?: Object): void;

	hasMethod(name: string): boolean;

	removeMethod(name: string): void;

	getMethod(name: string): Method;

	error(code?: number, message?: string, data?: any): JsonRpcError;

	call(request: Object, callback?: Function): void;
	call(request: Array<any>, callback?: Function): void;
	call(request: string, callback?: Function): void;

	http(): HttpServer;

	https(options?: NodeHttpsServerOptions): HttpsServer;

	middleware(options?: MiddlewareOptions): MiddlewareFunction;

	tcp(options?: ServerTcpOptions): TcpServer;

	tls(options?: TlsOptions): TlsServer;
}

export class Method {
	constructor(handler: Function, options?: MethodOptions);
	constructor(options?: MethodOptions);

	getHandler(): Function;

	execute(server: Server, params?: any, callback?: Function): void;
}

interface Methods {
	[name: string]: Function;
}

interface ClientHttpOptions extends ClientOptions, NodeHttpRequestOptions {
}
interface ClientHttpsOptions extends ClientOptions, NodeHttpsRequestOptions {
}
interface ClientTlsOptions extends ClientOptions, TlsOptions {
}
interface ClientHttp extends Client {
}
interface ClientHttps extends ClientHttp {
}
interface ClientTcp extends Client {
}
interface ClientTls extends ClientTcp {
}
interface HttpServer extends NodeHttpServer {
}
interface HttpsServer extends NodeHttpsServer {
}
interface TcpServer extends NodeTcpServer {
}
interface TlsServer extends NodeTlsServer {
}
interface MiddlewareFunction {
	(req: any, res: any, next?: Function): void;
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
