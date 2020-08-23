import React from 'react';
/**
 *
 */
class AddonListItem extends React.Component {
  /**
   * @return {*}
   */
  render() {
    return (
      <tr>
        <td>{this.props.addon.id}</td>
        <td>Namn</td>
        <td>Status</td>
        <td>Ver</td>
        <td>Author</td>
      </tr>
    );
  }
}

export default AddonListItem;
