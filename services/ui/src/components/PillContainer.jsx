import React from "react";
import { Col, Container, NiceContainer, Row } from "components/Components";
import { Nav, Tab } from "react-bootstrap";

const eventKeys = [
    "first",
    "second",
    "third",
    "fourth",
    "fifth",
    "sixth",
    "seventh",
    "eighth",
    "ninth",
    "tenth"
];

export const PillContainer = ({ children, pills, orientation }) => {
    if(pills.length > eventKeys.length){
        throw new Error("Pill length cannot be longer than eventKey length");
    }
    const pillContent = (
        <NiceContainer data="blue">
            <Nav variant="pills" className={ `flex-${orientation === "horizontal" ? "row" : "column"}` }>
                {
                    pills.map((text, index) => (
                        <Nav.Item key={ index } className={ `m${orientation === "horizontal" ? "r" : "b"}-2` }>
                            <Nav.Link eventKey={ eventKeys[index] }>{ text }</Nav.Link>
                        </Nav.Item>
                    ))
                }
            </Nav>
        </NiceContainer>
    );

    const orientations = () => ({
        horizontal: (
            <Container>
                <Row>
                    { pillContent }
                </Row>
                <Row>
                    { children }
                </Row>
            </Container>
        ),

        vertical: (
            <Container>
                <Row>
                    <Col sm={ 2 }>
                        { pillContent }
                    </Col>
                    <Col sm={ 10 }>
                        { children }
                    </Col>
                </Row>
            </Container>
        )
    }[orientation]);

    return <Tab.Container id="left-tabs-example" defaultActiveKey="first">
        { orientations() }
    </Tab.Container>;
};