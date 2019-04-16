import React from "react";
import {Image, Button, Container, Row, Col} from "react-bootstrap";

class Splash extends React.Component {
  constructor(props, context) {
    super(props);

    this.handleRedirect = this.handleRedirect.bind(this);
  }

  handleRedirect(path) {
    this.props.history.push(path);
  }

  render() {
    return(
      <div>
        <div className="navbar">
          <div className="logo">
              <Image
                src={require('../images/Logo.png')}
                fluid
                onClick={() => this.handleRedirect("/")}
              />
          </div>
        </div>
        
        <div className="floating-container centered-container" style={{width:"600px"}}>
          <Container>
            <Row>
              <div className="welcome-container">
                <h1>
                  Welcome!
                </h1>
                <br></br>
                <p>
                  Euphoria is a job searching platform that will not really get you a job, or really anything at all. Most likely, you will just end up losing your time.
                </p>
              </div>
            </Row>
            <hr></hr>
            <Row>
              <Col></Col>
              <Col xs={3}>
                <Button variant="info" size="lg" onClick={() => this.handleRedirect("/signin")}>
                  Sign in
                </Button>
              </Col>
              <Col></Col>
              <Col xs={3}>
                <Button variant="info" size="lg" onClick={() => this.handleRedirect("/signup")}>
                  Sign up
                </Button>
              </Col>
              <Col></Col>
            </Row>
          </Container>
        </div>
      </div>
    );
}
}
export default Splash
