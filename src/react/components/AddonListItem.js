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
    this.updateProgress = this.updateProgress.bind(this);
    this.db = this.props.db;
    this.addon = this.props.addon;
    this.state = {
      updating: false,
      updateAvailable: true,
      updateProgress: 0,
    };
  }
  /**
   *
   * @param {*} prevState
   */
  /**
   *
   */
  componentDidMount() {
    ipc.on('downloaded' + this.addon.id, () => {
      this.updateProgress(99);
    });

    ipc.on('updated' + this.addon.id, async () => {
      await this.db.insertData(this.addon);
      this.setState({updating: false, updateAvailable: false});
    });
  }

  /**
   *
   * @param {Integer} status
   */
  async updateProgress(status) {
    this.setState({
      updateProgress: status,
    });
  }

  /**
   *
   */
  updateAddon() {
    ipc.send('update', this.addon);
    this.setState({updating: true, updateAvailable: false});
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
