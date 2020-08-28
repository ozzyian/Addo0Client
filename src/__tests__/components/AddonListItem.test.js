import React from 'react';
import {shallow} from 'enzyme';
import AddonListItem from '../../react/components/AddonListItem';
import fs from 'fs';

describe('Snapshot tests', () => {
  let testAddon;
  beforeAll(() => {
    const testData = fs.readFileSync(
      './src/__tests__/resources/addon_info.json',
    );
    testAddon = JSON.parse(testData);
  });
  it('renders correctly', () => {
    const component = shallow(<AddonListItem addon={testAddon} />);
    expect(component).toMatchSnapshot();
  });

  it('renders correctly when updating', () => {
    const component = shallow(<AddonListItem addon={testAddon} />);
    component.setState({updating: true, updateAvailable: false});
    expect(component).toMatchSnapshot();
  });

  it('renders correctly when addon is updated', () => {
    const component = shallow(<AddonListItem addon={testAddon} />);
    component.setState({updating: false, updateAvailable: false});
    expect(component).toMatchSnapshot();
  });
});
