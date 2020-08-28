import React from 'react';
import AddonTable from './components/AddonTable';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
const ipc = require('electron').ipcRenderer;

/**
 *
 */
class App extends React.Component {
  /**
   *
   * @param {*} props
   */
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.state = {initiated: false, addons: []};
  }

  /**
   *
   */
  async componentDidMount() {
    const res = await ipc.invoke('app-load');
    if (!res) {
      return;
    } else {
      this.setState({initiated: true, addons: res});
    }
  }
  /**
   *
   * @param {Object} event
   */
  async onChange(event) {
    const path = event.target.files[0].path.split('\\');
    path.pop();
    const addons = await ipc.invoke('init-with-path', path.join('/'));
    this.setState({initiated: true, addons: addons});
  }
  /**
   *
   * @param {*} e
   */

  /**
   * @return {*}
   */
  render() {
    if (this.state.initiated) {
      return (
        <AddonTable
          initiated={this.state.initiated}
          addons={this.state.addons}
        ></AddonTable>
      );
    } else {
      return (
        <div className="custom-file center">
          <input
            type="file"
            className="custom-file-input"
            id="customFile"
            onChange={(e) => this.onChange(e)}
          ></input>
          <label
            className="custom-file-label"
            htmlFor="customFile"
            overflow="false"
          >
            Choose Wow.exe or ClassicWoW.exe
          </label>
        </div>
      );
    }
  }
}

export default App;
