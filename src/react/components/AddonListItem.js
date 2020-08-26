import React from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';
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
      updateProgress: 0,
    };
  }

  /**
   *
   */
  componentDidMount() {
    ipc.on('update' + this.addon.id, () => {
      this.setState({
        updateAvailable: false,
        updating: false,
        updateProgress: 0,
      });
    });
  }

  /**
   *
   */
  updateAddon() {
    ipc.send('update', this.addon);
    this.setState({updating: true, updateAvailable: false, updateProgress: 25});
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
      console.log('updating');
      return (
        <tr>
          <td>{this.props.addon.id}</td>
          <td>{this.props.addon.name}</td>
          <td>
            <ProgressBar animated now={this.state.updateProgress} />
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
