import React from 'react';
import AddonListItem from '../../react/components/AddonListItem';
import renderer from 'react-test-renderer';
import '@testing-library/jest-dom/extend-expect';
describe('Testing the component', () => {
  it('Renders the snapshot', () => {
    const tree = renderer.create(<AddonListItem addons={['1']} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
