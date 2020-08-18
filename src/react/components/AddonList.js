import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import AddonListItem from './AddonListItem';
import AddonManager from '../../electron/services/addon_manager';

class AddonList extends React.Component {
  render() {
    const aM = new AddonManager(__dirname);
    const filenames = aM.addonList();
    return (
      <ListGroup>
        <AddonListItem addons={filenames}></AddonListItem>
      </ListGroup>
    );
  }
}

export default AddonList;
