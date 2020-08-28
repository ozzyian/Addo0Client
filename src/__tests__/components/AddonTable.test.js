import React from 'react';
import {shallow} from 'enzyme';
import AddonTable from '../../react/components/AddonTable';
import fs from 'fs';

describe('Snapshot tests', () => {
  it('renders correctly', () => {
    const component = shallow(<AddonTable />);
    expect(component).toMatchSnapshot();
  });

  it('renders correctly when loading is done', () => {
    const testData = fs.readFileSync(
      './src/__tests__/resources/addon_info.json',
    );
    const testAddon = JSON.parse(testData);
    const component = shallow(<AddonTable />);
    component.setState({loading: false, addons: [testAddon]});
  });
});
