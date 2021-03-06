import React, { Component } from "react";
import {Button, Container, Row, Col} from "react-bootstrap";
import * as globals from "../globals.js";

import Navbar from "./Navbar";

class Applications extends Component {
  constructor(props, context) {
    super(props);

    this.state = {
      applicationsData: [],
      userData: {},
      location: "",
      industry: "",
      skillLevel: ""
    };

    this.handleGet = this.handleGet.bind(this);
    this.downloadDocument = this.downloadDocument.bind(this);

    this.application = this.application.bind(this);
  }

  componentDidMount() {
    const applicationsURL = globals.baseUrl + "/api/application/posting/" + this.props.match.params.postingId;
    this.handleGet(applicationsURL);

    return;
  }

  handleGet(url, userId) {
    fetch(url)
      .then(response => response.json())
      .then(data => {
        if(userId === undefined){
          this.setState({applicationsData: data});

          data.forEach(applicationData => {
            const userURL = globals.baseUrl + "/api/user/" + applicationData.userId;

            this.handleGet(userURL, applicationData.userId);
          });
        }
        else{
          var userData = this.state.userData;
          userData[userId] = data;
          this.setState({userData});
        }
      })
      .catch(err => {
      });

    return;
  }

  downloadDocument(documentData, filename) {

    var element = document.createElement('a');
    element.setAttribute('href', 'data:application/pdf;base64,' + encodeURIComponent(documentData));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);

    return;
  }

  application(props) {
    const applicationData = props.applicationData;
    const userData = this.state.userData[applicationData.userId];

    if(userData === undefined){
      return null;
    }

    return(
      <div className="floating-container posting-container-scrolling" style={{width:"600px"}}>
        <Container>
          <Row>
            <Col>
              <h1>
                {userData.name}
              </h1>
            </Col>
          </Row>
          <Row>
            <Col>
              <p style={{fontSize:"20px", color:"#AAA"}}>
                {userData.email}
              </p>
            </Col>
            <Col>
              <p style={{fontSize:"20px", color:"#AAA"}}>
                {userData.phoneNumber}
              </p>
            </Col>
          </Row>
          <Row>
            <Col>
              <p style={{fontSize:"15px"}}>
                {userData.educationLevel}
              </p>
            </Col>
          </Row>
          <br />
          <Row>
            <Col>
              <p style={{fontSize:"20px"}}>
                {userData.description}
              </p>
            </Col>
          </Row>
          <hr/>
          <Row>
            <Col>
              <Button
                variant="info"
                size="lg"
                block
                onClick={() => this.downloadDocument(applicationData.resume, (userData.name.split(' ').join('_') + "-Resume.pdf"))}>
                Download Resume
              </Button>
            </Col>
            <Col>
              <Button
                variant="info"
                size="lg"
                block
                onClick={() => this.downloadDocument(applicationData.coverLetter, (userData.name.split(' ').join('_') + "-Cover_Letter.pdf"))}>
                Download Cover Letter
              </Button>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  render() {
    const {
      applicationsData,
      userData
    } = this.state;

    if(Object.keys(userData).length === 0){
      return(
        <div>
          <Navbar {...this.props}/>
        </div>
      );
    }

    return(
      <div>
        <Navbar {...this.props}/>

        <div className="scrolling-container">
          {applicationsData.map(applicationData => (
            <this.application key={applicationData.applicationId} applicationData={applicationData} />
          ))}
        </div>
      </div>
    );
  }
}
export default Applications
