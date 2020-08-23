import React from 'react';
import Table from 'react-bootstrap/Table';
import AddonListItem from './AddonListItem';

/**
 *
 */
class AddonTable extends React.Component {
  /**
   *
   * @param {*} props
   */
  constructor(props) {
    super(props);
    this.state = {addons: []};
    this.showAddons = this.showAddons.bind(this);
  }

  /**
   * @return {*}
   */
  showAddons() {
    const addons = this.state.addons;
    return addons.map((addon) => {
      return <AddonListItem key={addon.id} addon={addon} />;
    });
  }
  /**
   * @return {*}
   */
  render() {
    return (
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Addon</th>
            <th>Status</th>
            <th>Version</th>
            <th>Author</th>
          </tr>
        </thead>
        <tbody>{this.showAddons()}</tbody>
      </Table>
    );
  }
}

export default AddonTable;
