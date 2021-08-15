import * as path from "path";
import * as fs from "fs";
import * as fse from "fs-extra";

import * as protobufjs from "@yunke/protobufjs";
import { inspectNamespace } from "@yunke/grpc-code-gen/build/pbjs";


const rootPath = path.join(process.cwd(), "/.grpc-code-gen/root.json");
const genProtoPath = path.join(process.cwd(), "mock/gen-proto");

const genImplementationData = (path: string, methods: any) => {
  const data: any[] = [];
  methods.map((item: any) => {
    if (path.indexOf(item.fullName.substring(0, item.fullName.lastIndexOf("."))) > -1) {
      data.push({
        [item.name]: {
          response: {},
        },
      });
    }
  });

  return JSON.stringify(data);
};

if (fs.existsSync(require.resolve(rootPath))) {
  fse.removeSync(genProtoPath);
  fse.mkdirSync(genProtoPath);

  const rootObject = require(rootPath);
  Object.keys(rootObject).map((serverName) => {
    const root = protobufjs.Root.fromJSON(rootObject[serverName]);
    const result: any = inspectNamespace(root);
    const { services, methods, messages, enums } = result;
    services.map((service: any) => {
      let protoServiceContent = "";
      const protoName = service.fullName.split(".")[0];
      const protoPath = `${serverName}.${service.fullName}`;

      protoServiceContent = `
import { IProtoItem } from "@yunke/trade-bff";

const ${service.name}: IProtoItem = {
  path: "${protoPath}",
  implementationData: ${genImplementationData(protoPath, methods)}
};
export default YkBackendAuthService;
`;
      fse.ensureDirSync(path.join(genProtoPath, protoName));
      const filePath = path.join(genProtoPath, protoName, `${service.name}.ts`);
      fse.writeFileSync(filePath, protoServiceContent);
    });
    console.log(methods ? "1" : "2", messages[0].fields , enums ? "1" : "2");
  });
} else {
  console.error("请先生成grpc脚手架代码");
}
