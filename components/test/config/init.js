// node_modules/@yunke/yunfly/bin/dev.js
// 兼容ts-node 10版本：
// 文件内容替换  `nodemon -e ts --exec ts-node ` 替换为 `nodemon -e ts --exec ts-node --cwd-mode `

const fs = require("fs");

const initChangeYunflyDevFile = () => {
  const yunflyDevPath = "node_modules/@yunke/yunfly/bin/dev.js";
  try {
    const isExist = fs.existsSync(yunflyDevPath);
    if (isExist) {
      let content = fs.readFileSync(yunflyDevPath, { encoding: "utf-8" });
      if (content.indexOf("--cwd-mode") === -1) {
        content = content.replace("nodemon -e ts --exec ts-node", "nodemon -e ts --exec ts-node --cwd-mode");
        fs.writeFileSync(yunflyDevPath, content);
      }
    }
  } catch (e) {
    console.log(e);
    process.exit();
  }
};

initChangeYunflyDevFile();
