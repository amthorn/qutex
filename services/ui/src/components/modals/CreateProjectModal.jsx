import { Button } from "components/base/Button";
import { HorizontalRule } from "components/base/HorizontalRule";
import PropTypes from "prop-types";
import React from "react";
import { Form, Modal } from "react-bootstrap";


const handleValidate = (event) => {
    if (event.currentTarget.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
    }

    event.preventDefault();
};

const CreateProjectModal = ({ title, help, openModalButtonText, openModalButtonProps, onSubmit }) => {
    const [name, setName] = React.useState("");
    const [show, setShow] = React.useState(false);

    const handleSubmit = (...event) => {
        handleValidate(...event);
        Promise.all([
            // request("/api/v1/projects/", { method: "POST", body: JSON.stringify({ name }) }),
            onSubmit()
        ]).then(() => setShow(false)).catch(alert);
    };

    // Issue with console warnings; Should be fixed in 1.5.3
    // https://github.com/react-bootstrap/react-bootstrap/issues/5075
    return <>
        <Button { ...openModalButtonProps } help={ help || "Create a New Project" } onClick={ () => setShow(true) }>
            { openModalButtonText }
        </Button>

        <Modal show={ show } onHide={ () => setShow(false) }>
            <Modal.Header closeButton={ true }>
                <Modal.Title>{ title || "Create Project" }</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={ handleSubmit } >
                    <Form.Group controlId="formProjectName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            required={ true }
                            type="text"
                            placeholder="Enter project name"
                            name="name"
                            value={ name }
                            onChange={ (event) => setName(event.target.value) }
                        />
                        <Form.Text className="text-muted">
                            This is the name of your project. It can be changed later in the project settings.
                        </Form.Text>
                    </Form.Group>
                    <HorizontalRule />
                    <div className="d-flex justify-content-end">
                        <Button id="submitNewProjectButton" color="info" type="submit" help="Submit new project">
                            Submit
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
            { undefined }
        </Modal>
    </>;
};

CreateProjectModal.propTypes = {
    help: PropTypes.string.isRequired,
    openModalButtonText: PropTypes.element.isRequired,
    openModalButtonProps: PropTypes.object,
    title: PropTypes.string
};

export { CreateProjectModal };