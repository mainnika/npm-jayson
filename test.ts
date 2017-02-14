/// <reference path="./bundle.d.ts" />

import * as jayson from 'jayson';

class ExtendFromJaysonClient extends jayson.Client {

    public static get Create(): ExtendFromJaysonClient {

        return new ExtendFromJaysonClient();
    }

    public static MakeRequest(): void {

        const client: ExtendFromJaysonClient = ExtendFromJaysonClient.Create;

        client.request('foo', { foo: 'bar' }, 0, () => { });
    }

    // public static get CreateHttp(): jayson.ClientHttp {
    //
    //     const client: ExtendFromJaysonClient = ExtendFromJaysonClient.Create;
    //
    //     return client.http();
    // }
}

class ExtendFromJaysonServer extends jayson.Server {

    public static get Create(): ExtendFromJaysonServer {

        return new ExtendFromJaysonServer();
    }

    public static get CreateHttp(): jayson.HttpServer {

        const server: ExtendFromJaysonServer = ExtendFromJaysonServer.Create;

        return server.http();
    }

    constructor() {

        const options: jayson.ServerOptions = {
            collect: true
        };

        super({}, options);

        this.method('foo', this.foo.bind(this));
    }

    private foo(args: any[], callback: (err: any, result: any) => void): void {

        const response: jayson.JsonRpcMessage = {
            id: 1,
            method: 'bar',
            version: 2
        };

        this.call(response, callback);
    }
}

