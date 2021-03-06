import React, { Component } from "react";
import {Form, Button, Col} from "react-bootstrap";
import * as globals from "../globals.js";

import Navbar from "./Navbar";

class EditPost extends Component {
  constructor(props, context) {
    super(props);

    this.state = {
      companyId: "",
      postingId: "",
      jobTitle: "",
      description: "",
      location: "",
      industry: "",
      skillLevel: "",
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleGet = this.handleGet.bind(this);
  }

  componentDidMount() {
    const url = globals.baseUrl + "/api/posting/" + this.props.match.params.postingId;

    globals.verifyUser(this.props.cookies, this.handleGet(url));

    return;
  }

  handleChange(event) {
    this.setState({[event.target.name]: event.target.value});

    return;
  }

  handleGet(url) {
    fetch(url)
      .then(response => response.json())
      .then(data => {
        this.setState({
            companyId: data.companyId,
            postingId: data.postingId,
            jobTitle: data.jobTitle,
            description: data.description,
            location: data.location,
            industry: data.industry,
            skillLevel: data.skillLevel
        });
      })
      .catch(err => {
      });

    return;
  }

  handleSubmit(event) {
    event.preventDefault(); //prevent redirect with form in url

    const form = event.currentTarget;
    let url = globals.baseUrl + "/api/posting";

    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    const {
      postingId,
      jobTitle,
      description,
      location,
      industry,
      skillLevel
    } = this.state;

    let data = {
      postingId,
      jobTitle,
      description,
      location,
      industry,
      skillLevel
    };

    fetch(url, {
        method: "PUT",
        body: JSON.stringify(data)
      })
      .then(response => response.json())
      .then(data => {
        if(data !== undefined && data.length === 0){
          alert("Post edited!");
          globals.handleRedirect(this.props, "/");
        }
      })
      .catch(err => {
      });

    return;
  }

  render() {
    const {
      jobTitle,
      description,
      location,
      industry,
      skillLevel
    } = this.state;

    return(
      <div>
        <Navbar {...this.props}/>

        <div className="floating-container centered-container" style={{width:"600px"}}>
          <h1>Edit Posting</h1>
          <hr></hr>
          <Form onSubmit={event => this.handleSubmit(event)}>
            <Form.Row>
              <Form.Group as={Col} controlId="formGridJobTitle">
                <Form.Label>Job Title</Form.Label>
                <Form.Control
                  required
                  type="jobTitle"
                  name="jobTitle"
                  value={jobTitle}
                  maxLength="24"
                  onChange={this.handleChange}/>
              </Form.Group>

              <Form.Group as={Col} controlId="formGridLocation">
                <Form.Label>Location</Form.Label>
                <Form.Control
                  required
                  as="select"
                  name="location"
                  value={location}
                  onChange={this.handleChange}>
                  <option>NEWYORK</option>
                  <option>LONDON</option>
                  <option>HONGKONG</option>
                  <option>BERLIN</option>
                  <option>BEIJING</option>
                  <option>WASHINGTON</option>
                </Form.Control>
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} controlId="formGridIndustry">
                <Form.Label>Industry</Form.Label>
                <Form.Control
                  required
                  as="select"
                  name="industry"
                  value={industry}
                  onChange={this.handleChange}>
                  <option>EDUCATION</option>
                  <option>ENERGY</option>
                  <option>FINANCE</option>
                  <option>FOOD</option>
                  <option>HEALTHCARE</option>
                  <option>INSURANCE</option>
                  <option>MEDIA</option>
                  <option>RETAIL</option>
                  <option>SERVICES</option>
                  <option>TECHNOLOGY</option>
                  <option>TRANSPORT</option>
                  <option>UTILITIES</option>
                </Form.Control>
              </Form.Group>

              <Form.Group as={Col} controlId="formGridSkillLevel">
                <Form.Label>Skill Level</Form.Label>
                <Form.Control
                  required
                  as="select"
                  name="skillLevel"
                  value={skillLevel}
                  onChange={this.handleChange}>
                  <option>INTERNSHIP</option>
                  <option>ENTRYLEVEL</option>
                  <option>ASSOCIATE</option>
                  <option>SENIOR</option>
                  <option>DIRECTOR</option>
                  <option>EXECUTIVE</option>
                </Form.Control>
              </Form.Group>
            </Form.Row>

            <Form.Group controlId="formGridDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                required
                as="textarea"
                name="description"
                value={description}
                maxLength="5000"
                rows="5"
                style={{resize:"none"}}
                onChange={this.handleChange}/>
            </Form.Group>

            <Button
              variant="info"
              onClick={event => globals.verifyUser(this.props.cookies, this.handleSubmit(event), this.state.companyId)}>
              Submit
            </Button>
          </Form>
        </div>
      </div>
    );
  }
}
export default EditPost
