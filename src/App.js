import React, { Component } from "react";
import EURO from "./contracts/EURO.json";
import getWeb3 from "./getWeb3";

import {Form, Button} from "react-bootstrap";
import Jumbotron from "react-bootstrap/Jumbotron";
import Row from "react-bootstrap/Row";

import 'bootstrap/dist/css/bootstrap.min.css';
import {JsonToTable} from "react-json-to-table";

import "./App.css";

class App extends Component {


  constructor(props) {
        super(props);

      this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
}

	state = { storageValue: 0, web3: null, accounts: null, contract: null, team1: null, score1:0, team2:null, score2:null, group:null, matches:[]};


  componentDidMount = async () => {
    try {

	const matches = [];
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

console.log(accounts);

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = EURO.networks[networkId];
      const instance = new web3.eth.Contract(
        EURO.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { accounts, contract } = this.state;

	let size = await contract.methods.getSize().call();
	console.log(size);


	for (let i = 0; i < size; i++) {
  		const res =await contract.methods.matches(i).call();
		let team = {team1:res.team1,score1:res.score1,score2:res.score2,team2:res.team2,group:res.group};
		this.state.matches.push(team);
  		console.log(res.team1);
	} 

    const response = 0;

console.log(this.state.matches);
    // Get the value from the contract to prove it worked.


    // Update state with the result.
    this.setState({ storageValue: response });
  };


    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

 handleSubmit(event) {
console.log(this.state.team1, this.state.score1, this.state.team2, this.state.score2,this.state.group);
    this.state.contract.methods.setMatch(this.state.team1,this.state.score1,this.state.team2, this.state.score2,this.state.group).send({ from:this.state.accounts[0]});

 event.preventDefault();}

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">


<h1>EuroChain</h1>

<Jumbotron>
 <Form onSubmit={this.handleSubmit}>
 
                        <Form.Group controlId="exampleForm.ControlInput1">
                            <Form.Label>Nazwa druzyny</Form.Label>
                            <Form.Control type="text" name="team1" placeholder="Team 1"
                                          onChange={this.handleChange}/>
                        </Form.Group>

                        <Form.Group controlId="exampleForm.ControlInput1">
                            <Form.Label>Gole</Form.Label>
                            <Form.Control type="number" name="score1" placeholder="0"
                                          onChange={this.handleChange}/>
		     </Form.Group>


                        <Form.Group controlId="exampleForm.ControlInput1">
                            <Form.Label>Nazwa druzyny</Form.Label>
                            <Form.Control type="text" name="team2" placeholder="Team 2"
                                          onChange={this.handleChange}/>

                        </Form.Group>
                        <Form.Group controlId="exampleForm.ControlInput1">
                            <Form.Label>Gole</Form.Label>
                            <Form.Control type="number" name="score2" placeholder="0" onChange={this.handleChange}/>

                        </Form.Group>

                        <Form.Group controlId="exampleForm.ControlInput1">
                            <Form.Label>Grupa</Form.Label>
                            <Form.Control type="text" name="group" placeholder="A" onChange={this.handleChange}/>

                        </Form.Group>
                        <Button variant="primary" type={"submit"}>
                            Save
                        </Button>

         

                    </Form>

</Jumbotron>


 <JsonToTable json={this.state.matches}/>

      </div>
    );
  }
}

export default App;
