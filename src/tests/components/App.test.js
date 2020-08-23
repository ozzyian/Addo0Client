import React from 'react';
import App from '../../react/App';
import renderer from 'react-test-renderer';

describe('Snapshot tests', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<App />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly when initlaized', () => {
    const mockObj = {
      target: {
        files: [{}],
      },
    };
    const component = renderer.create(<App />);
    component.getInstance().onChange(mockObj);
    expect(component.toJSON()).toMatchSnapshot();
  });
});
