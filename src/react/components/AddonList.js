import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import AddonListItem from './AddonListItem';

class AddonList extends React.Component {
  render() {
    return (
      <ListGroup>
        <AddonListItem addons={['1']}></AddonListItem>
      </ListGroup>
    );
  }
}

export default AddonList;
