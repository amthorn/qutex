import {
    AccordionContext,
    Accordion as Accrdn,
    Button, 
    Card, 
    Col,
    Row
} from "react-bootstrap";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import React, { useContext } from "react";


const CustomToggle = ({ eventKey, value, name }) => {
    const isCurrentEventKey = useContext(AccordionContext) === eventKey;

    return (
        <div>
            <Row>
                <Col md={ 3 }>
                    <div className="text-left">
                        { isCurrentEventKey ? <FaAngleDown /> : <FaAngleUp />} { name } Info
                    </div>
                </Col>
                <Col>
                    <div className="text-right">{ value }</div>
                </Col>
            </Row>
        </div>
    );
};

export const Accordion = ({ title, subtitle, content }) => 
    <Accrdn defaultActiveKey="0">
        <Card>
            <Card.Header>
                <Accrdn.Toggle as={ Button } className="w-100" variant="link" eventKey="0">
                    <CustomToggle name={ title } value={ subtitle } eventKey="0" />
                </Accrdn.Toggle>
            </Card.Header>
            <Accrdn.Collapse eventKey="0">
                <Card.Body className="pt-0">
                    { content }
                </Card.Body>
            </Accrdn.Collapse>
        </Card>
    </Accrdn>;