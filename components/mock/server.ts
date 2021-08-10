import * as grpc from "grpc";

import grpcObject from "../grpc-code-gen/grpcObj";

const trade_yxdj_proto = grpcObject.trade_trade_yxdj.trade_yxdj_proto;

// console.log(trade_yxdj_proto);
// ts-node ./src/mock/server.ts

function Delete(call: any, callback: any) {
  callback(null, { message: "Hello again, " + call.request.name });
}

function GetById(call: any, callback: any) {
  callback(null, { message: "Hello again, " + call.request.name });
}

function GetList(call: any, callback: any) {
  // call.request.pageIndex,
  const json = {
    "list": [
      {
        'libraryOptionId': 'string',
        'title': 'title',
        'optionType': 1
      }
    ], "total": 10
  };
  callback(null, json);
}

function Create(call: any, callback: any) {
  callback(null, { message: "Hello again, " + call.request.name });
}

function Update(call: any, callback: any) {
  callback(null, { message: "Hello again, " + call.request.name });
}

function GetDetailList(call: any, callback: any) {
  callback(null, { message: "Hello again, " + call.request.name });
}

function main() {
  const server = new grpc.Server();
  server.addService(trade_yxdj_proto.LibraryOptionService.service,
    { Delete, GetById, GetList, Create, Update, GetDetailList });
  // 端口从配置获取 todo
  server.bindAsync("127.0.0.1:52453", grpc.ServerCredentials.createInsecure(), () => {
    server.start();
  });
}

main();
