import * as protobufjs from "@yunke/protobufjs";
import {PROTO_TYPE_2_TS_TYPE_MAP} from "@yunke/grpc-code-gen/build/utils";
import {TS_TYPE_2_DEFAULT_MAP, stringLeftNumber} from "./utils";


/*type CommentConfig = {
    enable?: boolean;
    reg?: RegExp;
};*/

const genFieldObj = (typeMessage: protobufjs.Type) => {
    const {fields} = typeMessage;
    let jsonArr: string[] = [];
    Object.keys(fields).map((field) => {
        const {type: fieldType, resolvedType} = fields[field];
        const jsType = PROTO_TYPE_2_TS_TYPE_MAP[fieldType];
        //console.log(fieldType, jsType);
        if (fieldType === 'ActivityBase') {
            console.log(/*fields[field],*/resolvedType)
        }
        //protobufjs.Field
        let fieldValue: any = null;
        if (jsType !== undefined) {
            fieldValue = TS_TYPE_2_DEFAULT_MAP[jsType];
            jsonArr.push(`${field}: ${fieldValue},`);
        } else {
            //console.log('fffeee',resolvedType)
            if (resolvedType instanceof protobufjs.Type) {
                console.log('ddddd:',genFieldObj(resolvedType))
                jsonArr.push(...genFieldObj(resolvedType));
            }
            //console.log('typeof:', resolvedType instanceof protobufjs.Type);
        }
    });
    return jsonArr;
}


export default function genResponseData(opt: {
    typePath: string;
    typeMessage: protobufjs.Type;
}): string {
    const {
        typePath,
        typeMessage
    } = opt;

    if (typePath == 'trade_yxdj_proto.GetActivityResponse') {
        //console.log('typeMessage:',fields)
        //console.log(namespace,messages,enums)
        //const jsonArr = genFieldObj(typeMessage);
        //console.log('jsonArr', JSON.stringify(jsonArr));
    }

    const dataObj: string[] = genFieldObj(typeMessage);
    dataObj.unshift(`{`);
    let str = stringLeftNumber(dataObj.join('\n'), 10);
    str = str + stringLeftNumber(`\n}`, 8);
    return str;
}