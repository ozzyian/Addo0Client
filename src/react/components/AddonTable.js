import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import AddonListItem from './AddonListItem';
import Spinner from 'react-bootstrap/Spinner';
import DatabaseClient from '../../db/db_client';
import {ipcRenderer} from 'electron';

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
    this.db = new DatabaseClient('test');
    this.state = {path: this.props.path, loading: true, addons: []};
    this.showAddons = this.showAddons.bind(this);
  }

  /**
   *
   */
  async componentDidMount() {
    ipcRenderer.on('init', (_, addons) => {
      console.log('got data');
      this.setState({
        loading: false,
        addons: addons,
      });
    });

    const storedAddons = await this.db.getAll();

    if (storedAddons.length === 0) {
      ipcRenderer.send('init', this.props.path);
    } else {
      this.setState({addons: storedAddons, loading: false});
    }
  }
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
