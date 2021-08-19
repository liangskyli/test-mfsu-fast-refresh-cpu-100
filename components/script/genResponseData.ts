import * as protobufjs from "@yunke/protobufjs";
import { PROTO_TYPE_2_TS_TYPE_MAP } from "@yunke/grpc-code-gen/build/utils";
import { TS_TYPE_2_DEFAULT_MAP, stringLeftNumber, longsType } from "./utils";

type IOpts = {
  typeMessage: protobufjs.Type;
  protoName: string;
  root: protobufjs.Root;
  grpcCodeGenConfig: any;
};

let repeatList: string[] = [];

export default function genResponseData(opts: IOpts): string {
  const { typeMessage, protoName, root, grpcCodeGenConfig } = opts;

  const commentReg = /(@optional)|(@option)|[\r\n]/g;
  const longs = grpcCodeGenConfig?.loaderOptions?.longs;
  repeatList = [];

  const genFieldObj = (typeMessage: protobufjs.Type) => {
    const { fields } = typeMessage;
    let jsonArr: string[] = [];
    Object.keys(fields).map((field) => {
      const { type: fieldType, rule, comment } = fields[field];
      let tsType = PROTO_TYPE_2_TS_TYPE_MAP[fieldType];
      if (tsType) {
        if (longsType.indexOf(fieldType) > -1 && longs === String) {
          tsType = "string";
        }
      }

      const commentFilter = comment ? comment.replace(commentReg, '') : '';
      const commentStr = `/** ${commentFilter} */`;

      let fieldValue: any = null;
      if (tsType !== undefined) {
        fieldValue = TS_TYPE_2_DEFAULT_MAP[tsType];
        jsonArr.push(commentStr);
        if (rule === "repeated") {
          jsonArr.push(`${field}: [${fieldValue}],`);
        } else {
          jsonArr.push(`${field}: ${fieldValue},`);
        }
      } else {
        jsonArr.push(commentStr);
        repeatList.push(fieldType);
        const repeatCount = repeatList.filter((value) => {
          return value === fieldType;
        }).length;
        // 防止死循环
        if (repeatCount < 2) {
          let typePath = `${protoName}.${fieldType}`;
          const typeMessage = root.lookupType(typePath);
          const dataObj = genFieldObj(typeMessage);

          let str = "";
          if (rule === "repeated") {
            str = stringLeftNumber("[\n", 2);
            str = str + stringLeftNumber("{\n", 4);
            str = str + stringLeftNumber(dataObj.join("\n"), 4);
            str = str + stringLeftNumber(`\n}`, 2);
            str = str + stringLeftNumber(`\n]`, 0);
          } else {
            dataObj.unshift(`{`);
            str = str + stringLeftNumber(dataObj.join("\n"), 2);
            str = str + stringLeftNumber(`\n}`, 0);
          }

          jsonArr.push(`${field}: ${str},`);
        } else {
          if (rule === "repeated") {
            jsonArr.push(`${field}: [],`);
          } else {
            jsonArr.push(`${field}: {},`);
          }
        }
      }
    });
    return jsonArr;
  };

  const dataObj: string[] = genFieldObj(typeMessage);
  dataObj.unshift(`{`);
  let str = stringLeftNumber(dataObj.join("\n"), 10);
  str = str + stringLeftNumber(`\n}`, 8);

  return str;
}
