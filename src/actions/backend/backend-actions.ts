import { StringBody } from "@gatling.io/core";
import { http, HttpRequestActionBuilder } from "@gatling.io/http";

export enum Method {
  GET,
  POST,
  PUT,
  DELETE,
  HEAD,
  OPTIONS,
  PATCH,
  TRACE
}

class BackendAction {
  public name!: string;
  public method!: Method;
  public url!: string;
  public body: string | object| null = null;

 constructor({ name, method, url, body }: { name: string; method: Method; url: string , body?: string | object | null}) {
    this.name = name;
    this.method = method;
    this.url = url;
    if(body)
      this.body = body;
  }

  public setName(name: string): void {
    this.name = name;
  }
  public setUrl(url: string): void {
    this.url = url;
  }
  public buildHttp(): HttpRequestActionBuilder {
    let httpBuilder = null;
    switch (this.method) {
      case Method.GET:
        httpBuilder = http(this.name).get(this.url);
        break;
      case Method.POST:
        httpBuilder = http(this.name).post(this.url);
        break;
      case Method.PUT:
        httpBuilder = http(this.name).put(this.url);
        break;
      case Method.DELETE:
        httpBuilder = http(this.name).delete(this.url);
        break;
      case Method.HEAD:
        httpBuilder = http(this.name).head(this.url);
        break;
      case Method.OPTIONS:
        httpBuilder = http(this.name).options(this.url);
        break;
      case Method.PATCH:
        httpBuilder = http(this.name).patch(this.url);
        break;
      default:
        throw new Error("Unknown method");
    }
    
    if(this.body){
      let body = ""
      if(typeof this.body === "object")
        body = JSON.stringify(this.body)
      else
        body = this.body
      httpBuilder.body(StringBody(body));
    }
     

    return httpBuilder;
  }
  
  setBody(body: string | object) {
    this.body = body;

    return this;
  }

  clone(): BackendAction {
    return new BackendAction({
      name: this.name,
      method: this.method,
      url: this.url
    });
  }
}

class BackendService {
  public env!: string;
  constructor() {}

  public homeEndpoint = new BackendAction({
    name: "Home",
    method: Method.GET,
    url: "/"
  });
  public searchEndpoint = new BackendAction({
    name: "Search",
    method: Method.GET,
    url: "/computers"
  });
  public selectEndpoint = new BackendAction({
    name: "Select",
    method: Method.GET,
    url: "/"
  });

  public createEndpoint({
    name,
    method,
    url
  }: {
    name: string;
    method: Method;
    url: string;
  }): BackendAction {
    return new BackendAction({
      name: name,
      method: method,
      url: url
    });
  }
}

export default BackendService;
