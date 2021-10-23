import React from "react";
import { Col, Row } from "react-bootstrap";
import { ProjectChart, ProjectChart2 } from "views/Project/Charts";


export const Project = ({ pageData }) =>
    <>
         <Row>
             <Col xs="12">
                 <ProjectChart project={ pageData }/>
            </Col>
        </Row>
        <ProjectChart2 />
    </>;

Project.urlData = {
    url: "/api/v1/projects/",
    params: ["projectId"],
};