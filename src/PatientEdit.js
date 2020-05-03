import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { instanceOf } from 'prop-types';
import { Cookies, withCookies } from 'react-cookie';
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';
import AppNavbar from './AppNavbar';

class PatientEdit extends Component {

  emptyItem = {
    patientNumber: '',
    name: '',
    age: '',
    marritalStatus: '',
    gender: '',
    reportedDate: '',
    nationality: '',

    currentAddress: {
      houseNumber: '',
      city: '',
      state: '',
      street: '',
      village: '',
      area: '',
      pinCode: ''
    },

    exposureTo: {
      name: 'Imported'
    }
  };

  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  };

  constructor(props) {
    super(props);
    const {cookies} = props;
    this.state = {
      item: this.emptyItem,
      csrfToken: cookies.get('XSRF-TOKEN')
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleCurrentAddressChange = this.handleCurrentAddressChange.bind(this);
    this.handleExposureTo = this.handleExposureTo.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentDidMount() {
    console.log("PatientEdit: params.id;["+this.props.match.params.id+"]");
    if (this.props.match.params.id !== 'new') {
      try {
        const patient = await (await fetch(`{window._env_.API_URL}/api/patient/${this.props.match.params.id}`, {credentials: 'include'})).json();
        this.setState({item: patient});
      } catch (error) {
        this.props.history.push('/');
      }
      console.log("Edit Patient:["+JSON.stringify(this.state)+"]");
      //this.setState({item: patient});
    }
  }

  handleCurrentAddressChange (event) {
    console.log("handleCurrentAddressChange: ["+event.target.name+"]");
    const target = event.target;
    const value = target.value;
    const name = target.name.split('.')[1];
    let item = {...this.state.item};
    item.currentAddress[name]=value;
    this.setState({item});
    //console.log("handleCurrentAddressChange: changed state:["+JSON.stringify(this.state)+"]");
  }

  handleExposureTo (event) {
    console.log("handleExposureTo: ["+event.target.name+"]");
    const target = event.target;
    const value = target.value;
    const name = target.name.split('.')[1];
    let item = {...this.state.item};
    item.exposureTo[name]=value;
    this.setState({item});
    //console.log("handleCurrentAddressChange: changed state:["+JSON.stringify(this.state)+"]");
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    console.log("handleChange: name:["+name+"]");
    let item = {...this.state.item};
    console.log("handleChange: item:["+JSON.stringify(item)+"],["+item[name]+"]");
    item[name] = value;
    console.log("handleChange: item changed :["+item[name]+"]");
    this.setState({item});
  }

  async handleSubmit(event) {
    event.preventDefault();
    const {item, csrfToken} = this.state;
    //const {item} = this.state;
    console.log("Create/Edit Patient Submit:["+JSON.stringify(item)+"]");
    await fetch('{window._env_.API_URL}/api/patient' + (item.id ? '/' + item.patientNumber : ''), {
      method: (item.id) ? 'PUT' : 'POST',
      headers: {
        'X-XSRF-TOKEN': csrfToken,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(item),
      credentials: 'include'
    });
    this.props.history.push('/patients');
  }

  render() {
    const {item} = this.state;
    const title = <h2>{item.id ? 'Edit Patient' : 'Add Patient'}</h2>;

    return <div>
      <AppNavbar/>
      <Container>
        {title}
        <Form onSubmit={this.handleSubmit}>
          <FormGroup>
            <Label for="patientNumber">PatientNumber</Label>
            <Input type="text" name="patientNumber" id="patientNumber" value={item.patientNumber || ''}
                   onChange={this.handleChange} autoComplete="patientNumber"/>
          </FormGroup>
          <FormGroup>
            <Label for="name">Name</Label>
            <Input type="text" name="name" id="name" value={item.name || ''}
                   onChange={this.handleChange} autoComplete="name"/>
          </FormGroup>
          <FormGroup>
            <Label for="age">Age</Label>
            <Input type="text" name="age" id="age" value={item.age || ''}
                   onChange={this.handleChange} autoComplete="age"/>
          </FormGroup>
          <FormGroup>
            <Label for="marritalStatus">Marrital Status</Label>
            <Input type="text" name="marritalStatus" id="marritalStatus" value={item.marritalStatus || ''}
                   onChange={this.handleChange} autoComplete="marritalStatus"/>
          </FormGroup>
          <FormGroup>
            <Label for="gender">Gender</Label>
            <Input type="text" name="gender" id="gender" value={item.gender || ''}
                   onChange={this.handleChange} autoComplete="gender"/>
          </FormGroup>
          <FormGroup>
            <Label for="reportedDate">Reported Date</Label>
            <Input type="text" name="reportedDate" id="reportedDate" value={item.reportedDate || ''}
                   onChange={this.handleChange} autoComplete="reportedDate"/>
          </FormGroup>
          <FormGroup>
            <Label for="nationality">Nationality</Label>
            <Input type="text" name="nationality" id="nationality" value={item.nationality || ''}
                   onChange={this.handleChange} autoComplete="nationality"/>
          </FormGroup>
          <FormGroup>
            <Label for="houseNumber">House Number</Label>
            <Input type="text" name="currentAddress.houseNumber" id="currentAddress.houseNumber" value={item.currentAddress.houseNumber || ''}
                   onChange={this.handleCurrentAddressChange} autoComplete="address-level1"/>
          </FormGroup>
          <FormGroup>
            <Label for="city">City</Label>
            <Input type="text" name="currentAddress.city" id="currentAddress.city" value={item.currentAddress.city || ''}
                   onChange={this.handleCurrentAddressChange} autoComplete="address-level1"/>
          </FormGroup>
          <div className="row">
            <FormGroup className="col-md-4 mb-3">
              <Label for="state">State</Label>
              <Input type="text" name="currentAddress.state" id="currentAddress.state" value={item.currentAddress.state || ''}
                     onChange={this.handleCurrentAddressChange} autoComplete="address-level1"/>
            </FormGroup>
            <FormGroup className="col-md-5 mb-3">
              <Label for="street">Street</Label>
              <Input type="text" name="currentAddress.street" id="currentAddress.street" value={item.currentAddress.street || ''}
                     onChange={this.handleCurrentAddressChange} autoComplete="address-level1"/>
            </FormGroup>
            <FormGroup className="col-md-5 mb-3">
              <Label for="village">Village</Label>
              <Input type="text" name="currentAddress.village" id="currentAddress.village" value={item.currentAddress.village || ''}
                     onChange={this.handleCurrentAddressChange} autoComplete="address-level1"/>
            </FormGroup>
            <FormGroup className="col-md-5 mb-3">
              <Label for="area">Area</Label>
              <Input type="text" name="currentAddress.area" id="currentAddress.area" value={item.currentAddress.area || ''}
                     onChange={this.handleCurrentAddressChange} autoComplete="address-level1"/>
            </FormGroup>

            <FormGroup className="col-md-3 mb-3">
              <Label for="pincode">Postal Code</Label>
              <Input type="text" name="currentAddress.pinCode" id="currentAddress.pinCode" value={item.currentAddress.pinCode || ''}
                     onChange={this.handleCurrentAddressChange} autoComplete="address-level1"/>
            </FormGroup>
            <FormGroup className="col-md-3 mb-3">
              <Label for="exposureTo">Exposure To</Label>
              <select name="exposureTo.name" id="exposureTo.name" value={item.exposureTo.name || ''}
                     onChange={this.handleExposureTo}>
                     <option value="LocalTransmission">Local Transmission</option>
                     <option value="Imported">Imported</option>
                     <option value="">None</option>
              </select>
            </FormGroup>
          </div>
          <FormGroup>
            <Button color="primary" type="submit">Save</Button>{' '}
            <Button color="secondary" tag={Link} to="/patients">Cancel</Button>
          </FormGroup>
        </Form>
      </Container>
    </div>
  }
}

export default withCookies(withRouter(PatientEdit));
