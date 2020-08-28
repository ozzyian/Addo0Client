import React from 'react';
import {shallow} from 'enzyme';
import App from '../../react/App';

describe('Snapshot tests', () => {
  it('it renders correctly', () => {
    const component = shallow(<App />);
    expect(component).toMatchSnapshot();
  });

  it('renders correctly when file path is choosen', () => {
    const component = shallow(<App />);
    component.setState({initiated: true, addons: []});
    expect(component).toMatchSnapshot();
  });
});
