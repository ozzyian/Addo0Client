import React from 'react';
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
      updated: false,
      upateAvailable: true,
    };
  }

  /**
   *
   */
  componentDidMount() {
    ipc.on('update' + this.addon.id, () => {
      this.setState({updated: true});
    });
  }

  /**
   *
   */
  updateAddon() {
    ipc.send('update', this.addon);
  }
  /**
   * @return {*}
   */
  render() {
    if (this.state.updated) {
      return (
        <tr>
          <td>{this.props.addon.id}</td>
          <td>{this.props.addon.name}</td>
          <td>Updated</td>
          <td>{this.props.addon.gameVersionLatestFiles[0].projectFileName}</td>
          <td>{this.props.addon.authors[0].name}</td>
        </tr>
      );
    } else {
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
    }
  }
}

export default AddonListItem;
