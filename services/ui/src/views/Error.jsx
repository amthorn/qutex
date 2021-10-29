import Footer from "components/base/Footer";
import React from "react";
import { ThemeContextWrapper } from "components/Components";
import { themes } from "components/layout/ThemeContext";
import { Container, Row } from "react-bootstrap";

const NotFoundPage = () => 
    <ThemeContextWrapper theme={ themes.light }>
        <div className="wrapper">
            <div className="main-panel" data="blue">
                <div className="content p-5">
                    <Container fluid={ true } >
                        <Row className="justify-content-center">
                            <h1>Page Not Found:(</h1>
                        </Row>
                        <Row className="justify-content-center">
                            <span>404 Page not found</span>
                        </Row>
                    </Container>
                </div>
                <Footer fluid={ true }/>
            </div>
        </div>
    </ThemeContextWrapper>;

const AccessDenied = () => 
    <Container fluid={ true } >
        <Row className="justify-content-center">
            <h1>Access Denied:(</h1>
        </Row>
        <Row className="justify-content-center">
            <span>403 Access Denied</span>
        </Row>
    </Container>;

export {
    AccessDenied,
    NotFoundPage
};