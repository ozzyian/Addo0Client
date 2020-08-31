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
    let stateColumn;
    if (this.state.updateAvailable) {
      stateColumn = <button onClick={this.updateAddon}>Update</button>;
    } else if (this.state.updating) {
      stateColumn = <Spinner animation="border" role="status"></Spinner>;
    } else {
      stateColumn = 'Updated';
    }
    return (
      <tr>
        <td>{this.props.addon.id}</td>
        <td>{this.props.addon.name}</td>
        <td>{stateColumn}</td>
        <td>{this.props.addon.versionName}</td>
        <td>{this.props.addon.authors[0].name}</td>
      </tr>
    );
  }
}

export default AddonListItem;
