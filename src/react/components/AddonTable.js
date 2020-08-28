import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import AddonListItem from './AddonListItem';
import Spinner from 'react-bootstrap/Spinner';

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
    this.state = {loading: !this.props.initiated, addons: this.props.addons};
    this.showAddons = this.showAddons.bind(this);
  }

  /**
   *
   */
  componentDidMount() {}
  /**
   * @return {*}
   */
  showAddons() {
    return this.state.addons.map((addon) => {
      return <AddonListItem key={addon.id} addon={addon} />;
    });
  }

  /**
   * @return {*}
   */
  render() {
    if (this.state.loading) {
      return (
        <Spinner
          className="center-spinner"
          animation="border"
          role="status"
        ></Spinner>
      );
    } else {
      return (
        <Container id="container" fluid>
          <Row>
            <Button>Update all</Button>
            <Button>Sync with remote</Button>
          </Row>
          <Row>
            <Table responsive striped bordered hover>
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
          </Row>
        </Container>
      );
    }
  }
}

export default AddonTable;
