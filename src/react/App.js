import React from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import AddonList from './components/AddonList';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
const ipc = window.require('electron').ipcRenderer;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {reply: ''};
  }
  componentDidMount() {
    ipc.on('asynReply', (event, data) => {
      console.log('Message received');
      this.setState({reply: data});
    });
  }
  buttonClick = () => {
    ipc.send('aSynMessage', 'A async message to main');
  };
  render() {
    return (
      <Container className="App" fluid>
        <AddonList />
        <Button variant="secondary" onClick={this.buttonClick}>
          Skicka meddelande
        </Button>
        <h1 id="mess">Meddelande: {this.state.reply}</h1>
      </Container>
    );
  }
}

export default App;
