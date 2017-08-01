/// <reference path="./bundle.d.ts" />

import * as jayson from 'jayson';

class ExtendFromJaysonClient extends jayson.Client {

  public static get Create(): ExtendFromJaysonClient {

    return new ExtendFromJaysonClient();
  }

  public static test(): void {

    const client: ExtendFromJaysonClient = ExtendFromJaysonClient.Create;

    client.request('foo', { foo: 'bar' }, 0, (err?: {}, response?: jayson.JsonRpcMessageResponse<string>) => {
      response.id;
      response.version;
      response.result;
      response.error.code;
      response.error.data;
      response.error.message;
    });

    client.request('foo', { bar: 'foo' }, (err?: {}, error?: jayson.JsonRpcError, result?: string) => {
      result;
      error.code;
      error.data;
      error.message;
    });

    client.request(
      [
        client.request('foo', { foo: 'bar' }),
        client.request('foo'),
        client.request('foo', { foo: 'bar' }, '0'),
        client.request('foo', { bar: 'foo' }, 0),
        client.request('foo', { bar: 'foo' }, null),
        client.request('foo', { bar: 'foo' }, null)
      ],
      (err?: {}, responses?: jayson.JsonRpcMessageResponse[]) => {
        responses[5].id;
        responses[4].version;
        responses[3].result;
        responses[2].error.code;
        responses[1].error.data;
        responses[0].error.message;
      }
    );
  }
}

class ExtendFromJaysonServer extends jayson.Server {

  public static get Create(): ExtendFromJaysonServer {

    return new ExtendFromJaysonServer();
  }

  constructor() {

    const options: jayson.ServerOptions = {
      collect: true
    };

    super({}, options);

    this.method('foo', this.foo);
    this.method('bar', new ExtendFromJaysonMethod());
    this.method('relay', ExtendFromJaysonClient.Create);

    this.call(
      {
        id: 0,
        method: 'foo',
        params: {
          foo: 'bar'
        },
        version: 2
      },
      (err?: jayson.JsonRpcError, response?: jayson.JsonRpcMessageResponse<string>): void => {
        err.code;
        err.data;
        err.message;
        response.id;
        response.id;
        response.version;
        response.result;
        response.error.code;
        response.error.data;
        response.error.message;
      }
    );
    this.call(
      [
        {
          id: 0,
          method: 'foo',
          params: {
            foo: 'bar'
          },
          version: 2
        },
        {
          id: 0,
          method: 'foo',
          params: {
            foo: 'bar'
          },
          version: 2
        }
      ],
      (err: {}, responses: jayson.JsonRpcMessageResponse[]): void => {
        responses[5].id;
        responses[4].version;
        responses[3].result;
        responses[2].error.code;
        responses[1].error.data;
        responses[0].error.message;
      }
    );
  }

  private foo(args: { foo: string }, callback: (err?: {}, result?: { bar: string }) => void): void {

    callback(undefined, { bar: args.foo });
  }
}

class ExtendFromJaysonMethod extends jayson.Method<string, string> {

  public getHandler() {

    return (request: string, callback: (err?: {}, response?: string) => void) => {

      callback(undefined, request);
    };
  }
}
