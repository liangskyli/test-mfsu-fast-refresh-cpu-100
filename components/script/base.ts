import * as fs from "fs-extra";
import * as path from "path";
import * as protobufjs from "@yunke/protobufjs";
import { inspectNamespace } from "@yunke/grpc-code-gen/build/pbjs";
import genResponseData from "./genResponseData";
//import { get, set } from 'lodash';
import {genSpace} from "./utils";



export interface Options {
  baseDir?: string;
  rootPath: string;
}

const BASE_DIR = path.join(process.cwd(), "mock-code-gen");
/*const grpcCodeGenConfigPath = path.join(process.cwd(), "grpc-code-gen.config.js");

let grpcCodeGenConfig: any;
if (fs.existsSync(grpcCodeGenConfigPath)) {
  grpcCodeGenConfig = require(grpcCodeGenConfigPath);
}*/





const genImplementationData = (path: string, result: any, protoName: string, root: protobufjs.Root) => {
    const { /*services,*/ methods, /*messages, enums*/ } = result;

  /*  const namespace: TNamespace = {};
    messages.forEach((message: any) => {
        const packageName = getPackageName(message.fullName);
        const nameSpacePath = 'nested.' + packageName.replace(/\./g, '.nested.');
        console.log('dddddd',nameSpacePath)
        const latest = get(namespace, nameSpacePath, { messages: {} });
        if (!latest.messages) latest.messages = {}
        latest.messages[message.name] = message;
        set(namespace, nameSpacePath, latest);
    });
    enums.forEach((enumT: any) => {
        const packageName = getPackageName(enumT.fullName);
        const nameSpacePath = 'nested.' + packageName.replace(/\./g, '.nested.');
        const latest = get(namespace, nameSpacePath, { enums: {} });
        if (!latest.enums) latest.enums = {}
        latest.enums[enumT.name] = enumT;
        set(namespace, nameSpacePath, latest);
    });
    console.log(namespace,messages)

    /////*/

    const data: string[] = [];
    methods.map((item: any) => {
    if (path.indexOf(item.fullName.substring(0, item.fullName.lastIndexOf("."))) > -1) {
      let typePath = `${protoName}.${item.responseType}`;
      // responseType 默认Message不能有. 存在时标明是其它命名空间下的类型
      if (item.responseType.indexOf(".") > -1) {
        typePath = `${item.responseType}`;
      }
      const typeMessage = root.lookupType(typePath);
      //const message = typeMessage.create();

     const response =  genResponseData({typePath,typeMessage});
     //console.log('res',response);


      /////
      /*const response = typeMessage.toObject(
        message,
        (grpcCodeGenConfig && grpcCodeGenConfig.loaderOptions) || { defaults: true }
      );
      data.push(
        `{
      ${item.name}: {
        response: ${objectToString(response, 8)},
      },
    },`
      );*/
        data.push(
            `{
      ${item.name}: {
        response: ${response},
      },
    },`
        );
    }
  });

  return `[
    ${data.join(`\n${genSpace(4)}`)}
  ],`;
};

const firstUpperCaseOfWord = (str: string) => {
  const result: string[] = [];
  str.split("_").map((item) => {
    result.push(item.toLowerCase().replace(/^\w|\s\w/g, (w) => w.toUpperCase()));
  });
  return result.join("");
};

export async function gen(opt: Options): Promise<string> {
  const { baseDir: genMockPath = BASE_DIR, rootPath } = opt;

  fs.removeSync(genMockPath);
  console.info(`Clean dir: ${genMockPath}`);
  const genProtoPath = path.join(genMockPath, "proto");
  fs.ensureDirSync(genProtoPath);

  // mock 服务端口从50000开始自动生成
  let servicePort = 50000;
  let grpcServiceMockConfigList: string[] = [];
  grpcServiceMockConfigList.push(`module.exports = {`);
  const spaceServerNameMockList: string[] = [];
  const indexContent: string[] = [];
  indexContent.push(`import { grpcMockInit } from "@yunke/trade-bff";`);

  const rootObject = require(rootPath);
  Object.keys(rootObject).map((spaceServerName) => {
    const serverName = spaceServerName
      .split("_")
      .map((item, index) => {
        let value = [];
        if (index > 0) {
          value.push(item);
        }
        return value.join("");
      })
      .filter((item) => item !== "")
      .join("-");
    const root = protobufjs.Root.fromJSON(rootObject[spaceServerName]);
    const result: any = inspectNamespace(root);
    const { services, /*methods*/ /*messages, enums*/ } = result;
    const serviceMockContent = [];
    serviceMockContent.push(`import type { IMockService } from "@yunke/trade-bff";`);
    const protoItem: string[] = [];

    services.map((service: any) => {
      let protoServiceContent = "";
      const protoName = service.fullName.split(".")[0];
      const protoPath = `${spaceServerName}.${service.fullName}`;
      protoServiceContent = `import type { IProtoItem } from "@yunke/trade-bff";

const ${service.name}: IProtoItem = {
  path: "${protoPath}",
  implementationData: ${genImplementationData(protoPath, result, protoName, root)}
};
export default ${service.name};
`;
      fs.ensureDirSync(path.join(genProtoPath, protoName));
      const filePath = path.join(genProtoPath, protoName, `${service.name}.ts`);
      fs.writeFileSync(filePath, protoServiceContent);

      serviceMockContent.push(`import ${service.name} from "./proto/${protoName}/${service.name}";`);
      protoItem.push(`{ ...${service.name} },`);
    });
    const spaceServerNameMock = `${firstUpperCaseOfWord(spaceServerName)}Mock`;
    serviceMockContent.push(`
const ${spaceServerNameMock}: IMockService = {
  serviceName: "${serverName}",
  servicePort: ${servicePort},
  protoList: [
    ${protoItem.join(`\n${genSpace(4)}`)}
  ],
};
export default ${spaceServerNameMock};
    `);
    grpcServiceMockConfigList.push(
      ` '${serverName}': {
    "host": "127.0.0.1",
    "port": ${servicePort},
  },`
    );
    servicePort++;
    const filePath = path.join(genMockPath, `${spaceServerNameMock}.ts`);
    fs.writeFileSync(filePath, serviceMockContent.join("\n"));
    spaceServerNameMockList.push(spaceServerNameMock);
    indexContent.push(`import ${spaceServerNameMock} from "./${spaceServerNameMock}";`);
  });
  // index.ts
  indexContent.push("");
  indexContent.push(`grpcMockInit([
  ${spaceServerNameMockList.join(`,\n${genSpace(2)}`)}
]);`);
  const filePath = path.join(genMockPath, `index.ts`);
  fs.writeFileSync(filePath, indexContent.join("\n"));
  grpcServiceMockConfigList.push(`}`);
  const fileConfigPath = path.join(genMockPath, `grpc-service.mock.config.js`);
  fs.writeFileSync(fileConfigPath, grpcServiceMockConfigList.join("\n"));

  console.info(`Generate success in ${genMockPath}`);
  return genMockPath;
}
