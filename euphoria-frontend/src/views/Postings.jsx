import React from 'react'
import {Image, Button, Container, Row, Col, Form} from "react-bootstrap";

class Postings extends React.Component {
  constructor(props, context) {
    super(props);

    this.state = {
      postings_data: [],
      location: "",
      industry: "",
      skillLevel: ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleRedirect = this.handleRedirect.bind(this);
    this.handleGet = this.handleGet.bind(this);

    this.posting = this.posting.bind(this);
  }

  componentDidMount() {
    const url = "http://localhost:8080/api/posting/random";
    this.handleGet(url);
  }

  handleChange(event) {
    let url = "http://localhost:8080/api/posting"

    this.setState({[event.target.name]: event.target.value}, () => {

      const {
        location,
        industry,
        skillLevel,
      } = this.state;

      let filter_list = [location, industry, skillLevel];

      for (let i = 0; i < filter_list.length; i++){
        if (filter_list[i].endsWith("...")){
          filter_list[i] = "";
        }

        url += "/" + filter_list[i]
      }

      this.handleGet(url);
    });
  }

  handleRedirect(path) {
    this.props.history.push(path);
  }

  handleGet(url) {
    fetch(url)
    .then(response => {
      return response.json()
    })
    .then(data => {
      // Work with JSON data here
      this.setState({postings_data: data});
    })
    .catch(err => {
      // Do something for an error here
    })

    return;
  }

  posting(props) {
    const posting_data = props.posting_data;

    return(
      <div className="floating-container posting-container-scrolling" style={{width:"600px"}}>
        <Container>
          <Row>
            <Col>
              <h1>
                {posting_data.jobTitle}
              </h1>
            </Col>
          </Row>
          <Row>
            <Col>
              <p style={{fontSize:"20px", color:"#AAA"}}>
                {posting_data.location}
              </p>
            </Col>
          </Row>
          <Row>
            <Col>
              <p style={{fontSize:"15px", color:"#AAA"}}>
                {posting_data.industry}
              </p>
            </Col>
            <Col>
              <Image
                src={require("../images/" + posting_data.skillLevel + ".png")}
                style={{height:"20px"}}
              />
            </Col>
          </Row>
          <hr/>
          <br/>
          <Row>
            <Col>
              <p>
                {posting_data.description}
              </p>
            </Col>
          </Row>
          <br/>
          <Row>
            <Button variant="info" size="lg" block onClick={() => this.handleRedirect("/postings/apply/" + posting_data.postingId)}>
              Apply
            </Button>
          </Row>
        </Container>
      </div>
    );
  }

  render() {
    const {
      postings_data,
      location,
      industry,
      skillLevel,
    } = this.state;

    return(
      <div>
        <div className="navbar">
          <div className="logo">
            <Image
              src={require('../images/Logo.png')}
              fluid
              onClick={() => this.handleRedirect("/postings")}
            />
          </div>
        </div>

        <div className="scrolling-container">
          {postings_data.map(posting_data => (
            <this.posting key={posting_data.postingId} posting_data={posting_data} />
          ))}
        </div>

        <div className="floating-container postings-container-dropdown" style={{width:"900px", height:"100px"}}>
          <Form>
            <Form.Row>
              <Form.Group as={Col} controlId="formGridLocation">
                <Form.Control
                  required
                  as="select"
                  name="location"
                  value={location}
                  onChange={this.handleChange}>
                  <option>Location...</option>
                  <option>NEWYORK</option>
                  <option>LONDON</option>
                  <option>HONGKONG</option>
                  <option>BERLIN</option>
                  <option>BEIJING</option>
                  <option>WASHINGTON</option>
                </Form.Control>
              </Form.Group>

              <Form.Group as={Col} controlId="formGridIndustry">
                <Form.Control
                  required
                  as="select"
                  name="industry"
                  value={industry}
                  onChange={this.handleChange}>
                  <option>Industry...</option>
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
                <Form.Control
                  required
                  as="select"
                  name="skillLevel"
                  value={skillLevel}
                  onChange={this.handleChange}>
                  <option>Skill Level...</option>
                  <option>INTERNSHIP</option>
                  <option>ENTRYLEVEL</option>
                  <option>ASSOCIATE</option>
                  <option>SENIOR</option>
                  <option>DIRECTOR</option>
                  <option>EXECUTIVE</option>
                </Form.Control>
              </Form.Group>
            </Form.Row>
          </Form>

        </div>
    </div>
    );
  }
}
export default Postings
