import React from 'react';
import Spinner from 'react-bootstrap/Spinner';
const ipc = require('electron').ipcRenderer;
/**
 *
 */
class AddonListItem extends React.Component {
  /**
   *
   * @param {*} props
   */
  constructor(props) {
    super(props);
    this.updateAddon = this.updateAddon.bind(this);
    this.addon = this.props.addon;
    this.state = {
      updating: false,
      updateAvailable: true,
    };
  }
  /**
   *
   * @param {*} prevState
   */
  /**
   *
   */
  componentDidMount() {}

  /**
   *
   */
  async updateAddon() {
    const complete = ipc.invoke('update', this.addon);
    this.setState({updating: true, updateAvailable: false});
    const result = await complete;
    this.setState({updating: !result, updateAvailable: false});
  }
  /**
   * @return {*}
   */
  render() {
    if (this.state.updateAvailable) {
      return (
        <tr>
          <td>{this.props.addon.id}</td>
          <td>{this.props.addon.name}</td>
          <td>
            <button onClick={this.updateAddon}>Update</button>
          </td>
          <td>{this.props.addon.gameVersionLatestFiles[0].projectFileName}</td>
          <td>{this.props.addon.authors[0].name}</td>
        </tr>
      );
    } else if (this.state.updating) {
      return (
        <tr>
          <td>{this.props.addon.id}</td>
          <td>{this.props.addon.name}</td>
          <td>
            <Spinner animation="border" role="status"></Spinner>
          </td>
          <td>{this.props.addon.gameVersionLatestFiles[0].projectFileName}</td>
          <td>{this.props.addon.authors[0].name}</td>
        </tr>
      );
    } else {
      return (
        <tr>
          <td>{this.props.addon.id}</td>
          <td>{this.props.addon.name}</td>
          <td>Updated</td>
          <td>{this.props.addon.gameVersionLatestFiles[0].projectFileName}</td>
          <td>{this.props.addon.authors[0].name}</td>
        </tr>
      );
    }
  }
}

export default AddonListItem;
