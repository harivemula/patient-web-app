import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { Link, withRouter } from 'react-router-dom';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';


class PatientList extends Component {

    static propTypes = {
      cookies: instanceOf(Cookies).isRequired
    };

    constructor (props) {
      super(props);
      const { cookies } = props;
      this.state = {patients: [], csrfToken: cookies.get('XSRF-TOKEN'), isLoading: true };
      this.remove = this.remove.bind(this);
    }

    componentDidMount () {
      this.setState ({isLoading: true});
      console.log('componentDidMount:start');
      fetch ('{window._env_.API_URL}/api/patients', {credentials: 'include'})
        .then (response => response.json())
        .then (data => {
          console.log("Get Patient List:["+JSON.stringify(data)+"]");
          this.setState({patients: data, isLoading: false});
        })
        .catch(()=>this.props.history.push('/'));

        console.log('componentDidMount:state:'+JSON.stringify(this.state));
    }


    async remove (id) {
      await fetch (`{window._env_.API_URL}/api/patient/${id}`, {
        method: 'DELETE',
        headers: {
          'X-XSRF-TOKEN': this.state.csrfToken,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      }).then (()=> {
        console.log("Remove the patient from state with PatientNumber:["+id+"]");
        let updatedPatients = [...this.state.patients].filter(i=>i.patientNumber !== id);
        this.setState({patients: updatedPatients});
      });
    }

    render() {
      const {patients, isLoading} = this.state;

      if (isLoading) {
        return <p>Loading...</p>;
      }

      const patientList = patients.map(patient => {
        const address = `${patient.currentAddress?.houseNumber || ''}, ${patient.currentAddress?.city || ''}, ${patient.currentAddress?.state || ''}`;
        return <tr key={patient.id}>
          <td style={{whiteSpace: 'nowrap'}}>{patient.name}</td>
          <td>{patient.patientNumber}</td>
          <td>{address}</td>
          <td>{patient.travelledFrom?.map(travelloc => {
            return <div key={travelloc.id}>{new Intl.DateTimeFormat('en-US', {
              year: 'numeric',
              month: 'long',
              day: '2-digit'
            }).format(new Date(travelloc.arrivalDate))}, {travelloc.travelHistory.city}</div>
          })}</td>
          <td>
            <ButtonGroup>
              <Button size="sm" color="primary" tag={Link} to={"/patients/" + patient.patientNumber}>Edit</Button>
              <Button size="sm" color="danger" onClick={() => this.remove(patient.patientNumber)}>Delete</Button>
            </ButtonGroup>
          </td>
        </tr>
      });
      return (
            <div>
              <AppNavbar/>
              <Container fluid>
                <div className="float-right">
                  <Button color="success" tag={Link} to="/patients/new">Add Patient</Button>
                </div>
                <h3>Patient List</h3>
                <Table className="mt-4">
                  <thead>
                  <tr>
                    <th width="20%">Name</th>
                    <th width="10%">Patient Number</th>
                    <th width="20%">Address</th>
                    <th>Travel Loation</th>
                    <th width="10%">Actions</th>
                  </tr>
                  </thead>
                  <tbody>
                  {patientList}
                  </tbody>
                </Table>
              </Container>
            </div>
          );
      }

}

export default withCookies(withRouter(PatientList));;
