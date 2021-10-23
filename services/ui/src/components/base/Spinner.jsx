import React from "react";
import { Spinner as Spnr } from "reactstrap";
import { Container, Row } from "components/base/BaseComponents";

export const Spinner = ({ loading = true, sm, md, lg, xl, ...props }) => { // eslint-disable-line no-unused-vars
    const spinnerStyling = {
        // use defaults for sm
        ...(md ? { width: "3rem", "height": "3rem"} : {}),
        ...(lg ? { width: "5rem", "height": "5rem"} : {}),
        ...(xl ? { width: "8rem", "height": "8rem"} : {}),
    };

    return (
        <Container>
            <Row className="align-items-center justify-content-center" style={ { "height": "87vh" } }>
                { loading ? <Spnr { ...props } style={ { ...spinnerStyling, ...props.style } }/> : undefined }
            </Row>
        </Container>
    );
};