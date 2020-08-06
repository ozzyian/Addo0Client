const fs = require("fs");

module.exports = class AddonManager {
  constructor(wowPath) {
    this.wowPath = wowPath;
  }

 async addonList() {
      return new Promise((resolve, reject) =>{
          fs.readdir(this.wowPath, (err, files)=>{
              err ? reject(err) : resolve(files);
          });
      });
  }
}

