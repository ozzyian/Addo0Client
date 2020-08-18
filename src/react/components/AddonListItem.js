import React from 'react';
import ListGroupItem from 'react-bootstrap/ListGroupItem';

class AddonListItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
    };
  }

  componentDidMount() {
    const getAddons = async () => {
      const addons = await this.props.addons;
      this.setState({id: addons[0]});
    };
    getAddons();
  }
  render() {
    return <ListGroupItem>id: {this.state.id}</ListGroupItem>;
  }
}

export default AddonListItem;
