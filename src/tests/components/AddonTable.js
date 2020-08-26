import React from 'react';
import AddonTable from '../../react/components/AddonTable';
import renderer from 'react-test-renderer';

describe('Snapshot test for AddonTable component', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<AddonTable />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with item in the list', () => {
    const component = renderer.create(
      <AddonTable
        addons={[
          {id: 1, data: ''},
          {id: 2, data: ''},
        ]}
      />,
    );
    component.getInstance().showAddons();
    expect(component.toJSON()).toMatchSnapshot();
  });
});
