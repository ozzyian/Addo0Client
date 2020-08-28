/* eslint-disable no-unused-vars */
/* eslint-disable linebreak-style */
// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import {configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({adapter: new Adapter()});
import '@testing-library/jest-dom/extend-expect';
const {ipcRenderer} = require('electron');

jest.mock(
  'electron',
  () => {
    const mElectron = {
      ipcRenderer: {on: jest.fn(), send: jest.fn(), invoke: jest.fn()},
    };
    return mElectron;
  },
  {virtual: true},
);
