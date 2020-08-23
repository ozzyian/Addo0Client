import React from 'react';
import App from '../../react/App';
import renderer from 'react-test-renderer';

describe('Snapshot test for App.js', () => {
  it('renders correctly when not initialized', () => {
    const tree = renderer.create(<App></App>).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly when initialized', () => {
    const component = renderer.create(<App></App>);
    component.getInstance().onChange({
      target: {
        files: [{path: 'path'}],
      },
    });

    expect(component.toJSON()).toMatchSnapshot();
  });
});
