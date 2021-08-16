import * as path from "path";
import * as fse from "fs-extra";
import * as protobufjs from "@yunke/protobufjs";
import { inspectNamespace } from "@yunke/grpc-code-gen/build/pbjs";

const rootPath = path.join(process.cwd(), "/.grpc-code-gen/root.json");
const genMockPath = path.join(process.cwd(), "/gen-mock");

const genImplementationData = (path: string, methods: any) => {
  const data: string[] = [];
  methods.map((item: any) => {
    if (path.indexOf(item.fullName.substring(0, item.fullName.lastIndexOf("."))) > -1) {
      data.push(
        `{
      ${item.name}: {
        response: {},
      },
    },`
      );
    }
  });

  return `[
    ${data.join("\n    ")}
  ],`;
};

const firstUpperCaseOfWord = (str: string) => {
  const result: string[] = [];
  str.split("_").map((item) => {
    result.push(item.toLowerCase().replace(/^\w|\s\w/g, (w) => w.toUpperCase()));
  });
  return result.join("");
};

if (fse.pathExistsSync(rootPath)) {
  fse.removeSync(genMockPath);
  const genProtoPath = path.join(genMockPath, "proto");
  fse.ensureDirSync(genProtoPath);

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
    const { services, methods /*messages, enums*/ } = result;
    const serviceMockContent = [];
    serviceMockContent.push(`import { IMockService } from "@yunke/trade-bff";`);
    const protoItem: string[] = [];

    services.map((service: any) => {
      let protoServiceContent = "";
      const protoName = service.fullName.split(".")[0];
      const protoPath = `${spaceServerName}.${service.fullName}`;
      protoServiceContent = `import { IProtoItem } from "@yunke/trade-bff";

const ${service.name}: IProtoItem = {
  path: "${protoPath}",
  implementationData: ${genImplementationData(protoPath, methods)}
};
export default ${service.name};
`;
      fse.ensureDirSync(path.join(genProtoPath, protoName));
      const filePath = path.join(genProtoPath, protoName, `${service.name}.ts`);
      fse.writeFileSync(filePath, protoServiceContent);

      serviceMockContent.push(`import ${service.name} from "./proto/${protoName}/${service.name}";`);
      protoItem.push(`{ ...${service.name} },`);
    });
    const spaceServerNameMock = `${firstUpperCaseOfWord(spaceServerName)}Mock`;
    serviceMockContent.push(`
const ${spaceServerNameMock}: IMockService = {
  serviceName: "${serverName}",
  servicePort: ${servicePort},
  protoList: [
    ${protoItem.join("\n    ")}
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
    fse.writeFileSync(filePath, serviceMockContent.join("\n"));
    spaceServerNameMockList.push(spaceServerNameMock);
    indexContent.push(`import ${spaceServerNameMock} from "./${spaceServerNameMock}";`);
  });
  // index.ts
  indexContent.push("\n");
  indexContent.push(`grpcMockInit([
  ${spaceServerNameMockList.join(",\n  ")}
]);`);
  const filePath = path.join(genMockPath, `index.ts`);
  fse.writeFileSync(filePath, indexContent.join("\n"));
  grpcServiceMockConfigList.push(`}`);
  const fileConfigPath = path.join(genMockPath, `grpc-service.mock.config.js`);
  fse.writeFileSync(fileConfigPath, grpcServiceMockConfigList.join("\n"));
} else {
  console.error("请先生成grpc脚手架代码");
}
