import * as protobufjs from "@yunke/protobufjs";
import {PROTO_TYPE_2_TS_TYPE_MAP} from "@yunke/grpc-code-gen/build/utils";
import {TS_TYPE_2_DEFAULT_MAP, stringLeftNumber} from "./utils";


/*type CommentConfig = {
    enable?: boolean;
    reg?: RegExp;
};*/


let repeatList: string[] = [];

const genFieldObj = (typeMessage: protobufjs.Type, protoName: string, root: protobufjs.Root, oldFieldType?: string) => {
    const {fields} = typeMessage;
    let jsonArr: string[] = [];
    Object.keys(fields).map((field) => {
        const {type: fieldType, rule} = fields[field];
        const jsType = PROTO_TYPE_2_TS_TYPE_MAP[fieldType];
        //console.log(fieldType, jsType);
        if (fieldType === 'BlockRelation') {
            return;
        }
        if (oldFieldType === fieldType) {
            console.log('ddddddd')
            //return;
        }
        //protobufjs.Field
        let fieldValue: any = null;
        if (jsType !== undefined) {
            fieldValue = TS_TYPE_2_DEFAULT_MAP[jsType];
            jsonArr.push(`${field}: ${fieldValue},`);
        } else {
            const repeatCount = repeatList.filter((value => {
               return  value === fieldType;
            })).length;
            if(repeatCount < 5) {
console.log(repeatList.length,repeatCount)

                if (rule === 'repeated') {
                    repeatList.push(fieldType);
                }

                let typePath = `${protoName}.${fieldType}`;
                // 默认Message不能有. 存在时标明是其它命名空间下的类型
                /*if (item.responseType.indexOf(".") > -1) {
                    typePath = `${item.responseType}`;
                }*/
                const typeMessage = root.lookupType(typePath);
                //typeMessage.fields
                //typeMessage.fieldsArray
                console.log(rule, typePath)

                const dataObj = genFieldObj(typeMessage, protoName, root, fieldType);
                //console.log(dataObj);
                if (rule === undefined) {

                }
                let str = '';
                if (rule === 'repeated') {
                    str = stringLeftNumber('[\n', 2);
                    str = str + stringLeftNumber('{\n', 4);
                    str = str + stringLeftNumber(dataObj.join('\n'), 4);
                    str = str + stringLeftNumber(`\n}`, 2);
                    str = str + stringLeftNumber(`\n]`, 0);
                } else {
                    dataObj.unshift(`{`);
                    str = str + stringLeftNumber(dataObj.join('\n'), 2);
                    str = str + stringLeftNumber(`\n}`, 0);
                }

                jsonArr.push(`${field}: ${str},`);
            }

        }
    });
    return jsonArr;
}


export default function genResponseData(opt: {
    typePath: string;
    typeMessage: protobufjs.Type;
    protoName: string;
    root: protobufjs.Root;
}): string {
    const {
        typePath,
        typeMessage,
        protoName,
        root
    } = opt;

    let str = '';

    if (typePath == 'trade_yxdj_proto.GetLibraryOptionByIdResponse') {

    }
    const dataObj: string[] = genFieldObj(typeMessage, protoName, root);
    dataObj.unshift(`{`);
    /*let*/
    str = stringLeftNumber(dataObj.join('\n'), 10);
    str = str + stringLeftNumber(`\n}`, 8);


    return str;
}