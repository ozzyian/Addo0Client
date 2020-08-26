import React from 'react';
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
  }

  /**
   *
   * @param {*} e
   */
  onChange(e) {
    if (e.target.files[0] === undefined) {
      this.setState({path: ''});
    } else {
      const path = e.target.files[0].path.split('\\');
      path.pop();
      this.setState({path: path.join('/'), initiated: true});
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
      return <AddonTable path={this.state.path}></AddonTable>;
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
