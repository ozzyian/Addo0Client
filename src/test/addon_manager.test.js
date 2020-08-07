const fs = require('fs');
const AddonManager = require('../renderer/services/addon_manager.js');
const assert = require('chai').assert;

const addonManager = new AddonManager(__dirname);

describe('Tests for the addonManager module', () => {
  it('Returns array with all addons', () => {
    return addonManager.addonList().then((result) => {
      assert.isArray(result, 'Should be an array');
      assert.equal(result.length, 1, 'Should equal length of 1');
    });
  });

  it('Extracts the content from a .toc file', () => {
    const tmp = require('tmp');

    const tmpobj = tmp.fileSync({
      mode: 0o644,
      prefix: 'addon',
      postfix: '.toc',
    });

    fs.appendFile(tmpobj.name, '## X-Curse-Project-ID: 326516', (err) => {
      // let curseId;
      if (err) {
        throw err;
      } else {
        console.log('line added');
        addonManager.readLinesFromToc(tmpobj.name).then((lines) => {
          assert.isString(lines);
          assert.equal(lines, '## X-Curse-Project-ID: 326516');
          tmpobj.removeCallback();
        });
      }
    });
  });

  it('Returns a curse-id located in a .toc file', async () => {
    fileData = ['dwasdsd\n', '## X-Curse-Project-ID: 326516\n'];
  });
});
