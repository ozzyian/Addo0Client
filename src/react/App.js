import React from 'react';
import DatabaseClient from '../db/db_client';
import AddonTable from './components/AddonTable';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';

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
    this.state = {initiated: false, path: ''};

    this.db = new DatabaseClient('test');
  }

  /**
   *
   * @param {*} e
   */
  onChange(e) {
    if (e.target.files[0] === undefined) {
      this.setState({path: ''});
    } else {
      const path = e.target.files[0].path;
      this.setState({path: path, initiated: true});
    }
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
      return <AddonTable></AddonTable>;
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
            Choose Wow.exe or ClasicWoW.exe
          </label>
        </div>
      );
    }
  }
}

export default App;
