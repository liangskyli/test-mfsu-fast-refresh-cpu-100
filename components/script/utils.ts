


//const longsType = ['double', 'float', 'int64', 'uint64', 'sint64', 'fixed64', 'sfixed64'];

export const TS_TYPE_2_DEFAULT_MAP: { [key: string]: any } = {
  'number': 1,
  'boolean': true,
  'string': '\'\'',
};

export const PROTO_TYPE_2_JSON_SEMANTIC_MAP: { [key: string]: string } = {
  'double': 'NumberSchema',
  'float': 'NumberSchema',
  'int32': 'NumberSchema',
  'int64': 'NumberSchema',
  'uint32': 'NumberSchema',
  'uint64': 'NumberSchema',
  'sint32': 'NumberSchema',
  'sint64': 'NumberSchema',
  'fixed32': 'NumberSchema',
  'fixed64': 'NumberSchema',
  'sfixed32': 'NumberSchema',
  'sfixed64': 'NumberSchema',
  'bool': 'BooleanSchema',
  'string': 'StringSchema',
  'bytes': 'StringSchema',
};


export const genSpace = (num: number) => {
  let space = "";
  for (let i = 0; i < num; i++) {
    space += " ";
  }
  return space;
};

export const stringLeftNumber = (jsonStr: string, num: number) => {
  let res = "";
  jsonStr.split("").map((char) => {
    res += char;
    if (char === "\n") {
      res += genSpace(num);
    }
  });
  return res;
};

export const objectToString = (json: { [k: string]: any }, num: number) => {
  const jsonStr = JSON.stringify(json, null, 2);
  return stringLeftNumber(jsonStr, num);
};



