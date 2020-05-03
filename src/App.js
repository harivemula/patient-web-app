import React, { Component } from 'react';
import './App.css';
import Home from './Home';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import PatientList from './PatientList';
import PatientEdit from './PatientEdit';
import { CookiesProvider } from 'react-cookie';

class App extends Component {
   render() {
     return(
       <CookiesProvider>
         <Router>
          <Switch>
            <Route path='/' exact={true} component={Home}/>
            <Route path='/patients' exact={true} component={PatientList}/>
            <Route path='/patients/:id' component={PatientEdit}/>
          </Switch>
        </Router>
      </CookiesProvider>
     )
   }


/*
  state = {
    isLoading: true,
    patients: []
  };


  async componentDidMount() {
    const response = await fetch('/api/patients');
    const body = await response.json();
    this.setState({patients: body, isLoading: false});
  }

  render() {
    const {patients, isLoading} = this.state;

    if (isLoading) {
      return <p>Loading...</p>
    }
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <div className="App-intro">
            <h2>Patients List</h2>
            {patients.map(patient =>
              <div key={patient.id}>
                {patient.name}
              </div>
            )}
          </div>

        </header>
      </div>
    );

  }
*/

}

export default App;
