import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

export default function Home() {
  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <h1 className="text-center mb-4">Welcome to my Battery Comparison Project</h1>
          <p className="lead text-center">
            Hi, I'm a recent computer science grad passionate about batteries and data analytics. 
            This is my personal project to create a community-driven platform for honest, unbiased battery information.
          </p>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={6}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title>What's this all about?</Card.Title>
              <Card.Text>
                I believe everyone should have access to clear, unbiased information about batteries. Here, you can:
                <ul>
                  <li>Compare different batteries</li>
                  <li>Learn about various manufacturers</li>
                  <li>Find local installers</li>
                  <li>Share your experiences and knowledge</li>
                </ul>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title>How you can contribute</Card.Title>
              <Card.Text>
                This is a community effort, and your input is crucial! Here's how you can help:
                <ul>
                  <li>Report any inaccurate information you find</li>
                  <li>Rate batteries you've used</li>
                  <li>Share your experiences in the forum</li>
                  <li>Suggest new features</li>
                </ul>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>The Story Behind This Project</Card.Title>
              <Card.Text>
                After graduating, I briefly worked in the battery industry. While I loved learning about batteries, 
                I realized sales wasn't for me. What I really enjoyed was analyzing data and helping people understand their options.
              </Card.Text>
              <Card.Text>
                Initially, the company I worked for inspired me to start this project as a hobby, using my own data and resources. 
                They were supportive at first, but after a month, they changed their stance, expecting me to develop it for them 
                (unpaid and without direction, data or resources). When they threatened legal action, I decided to cut ties with them.
              </Card.Text>
              <Card.Text>
                Despite this setback, I continued developing the project independently. It remains a non-commercial, 
                personal passion project. To cover server costs and development resources, I may include some ads, 
                but commercialization is not the goal. I'm hoping that someday it will help me land a job in the tech industry.
              </Card.Text>
              <Button variant="primary" href="project-story">Read the Full Story</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>What's Next?</Card.Title>
              <Card.Text>
                I'm constantly working on improving this platform. In the future, I hope to incorporate more advanced analytics, 
                maybe even some AI and machine learning tools. But for now, let's focus on building a solid, reliable resource together.
              </Card.Text>
              <Card.Text className="text-center">
                <strong>Thanks for checking out my project. Let's learn about batteries together!</strong>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}