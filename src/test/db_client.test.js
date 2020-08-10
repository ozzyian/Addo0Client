const DbClient = require('../renderer/services/db_client.js');
const fs = require('fs');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;
chai.use(chaiAsPromised);

describe('Tests the functionality of the local database', () => {
  const db = new DbClient();
  it('Adds a json object to the local database', async () => {
    const tempAddon = JSON.parse(
      fs.readFileSync(__dirname + '/resources/addon_info.json'),
    );
    await db.setAddonData(tempAddon);
    const res = await db.getAddonData(tempAddon.id);
    expect(res).to.deep.equal(tempAddon);
  });

  it('Throws an error with an invalid parameter', async () => {
    await expect(db.setAddonData(undefined)).to.be.rejectedWith(
      'Invalid parameter...',
    );
    await expect(db.getAddonData('2')).to.be.rejectedWith(
      'Could not retrieve data from database...',
    );
  });
});
