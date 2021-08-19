export const longsType = [
  "double",
  "float",
  "int64",
  "uint64",
  "sint64",
  "fixed64",
  "sfixed64",
];

export const TS_TYPE_2_DEFAULT_MAP: { [key: string]: any } = {
  number: 0,
  boolean: true,
  string: "''",
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
