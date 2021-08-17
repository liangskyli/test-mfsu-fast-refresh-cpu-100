import * as fs from "fs-extra";
import * as path from 'path';
import * as base from "./base";
import type { Options } from "./base";

const opt: any = {};

const rootPath = path.join(process.cwd(), "/.grpc-code-gen/root.json");

if (!fs.pathExistsSync(rootPath)) {
    console.error(`请先生成grpc脚手架代码, root.json file not exits: ${rootPath}`);
    process.exit(1);
}

opt.rootPath = rootPath;

base.gen(opt as Options)
    .catch((err: any) => {
        console.error(err);
    });
