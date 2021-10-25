// import { request } from "functions/request";
import { sendCode } from "functions/auth";
import { toast } from "react-toastify";
import { 
    Button,
    Container, 
    Form, 
    NiceContainer, 
    Row,
    Spinner
} from "components/Components";
import React, { useState } from "react";


export const Register = (props) => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState();

    // const [emailExists, setEmailExists] = useState(false);

    const onSubmit = () => {
        if(!email){
            toast.error("A Webex Email must be provided.");
            return;
        }


        // TODO: Re-enable when "forgot password" is available
        // if(emailExists){
        //     toast.error("An account with that Webex Email already exists.")
        //     return;
        // }
        setLoading(true);
        sendCode(email).then(success => {
            setLoading(false);
            if (success) {
                props.history.push("/token_verify");
            }
            return success;
        }).catch(alert);
    };

    const setEmailWithCheck = (eml) => {
        setEmail(eml);

        // request(`/api/v1/users?email=${encodeURIComponent(eml)}`, { method: "GET" }, { notifications: false }).then(
        //     ({ response }) => setEmailExists(response.status !== 404) // eslint-disable-line no-magic-numbers
        // ).catch(alert);
    };

    const registerForm = () =>
        <Form>
            <Form.Input
                placeholder="Enter Webex Email"
                name="emailInput"
                label="Webex Email"
                onChange={ ({ target }) => { setEmailWithCheck(target.value); } }
                invalid={ email === "" }
                feedbackMessage="Webex Email is required"
            />
        </Form>;

    const registerPage = () =>
        <Container fluid={ true } className="d-flex justify-content-center flex-column min-vh-100">
            <NiceContainer
                className="p-4 align-self-center w-25 flex-grow-1"
                style={ { "margin": "15%", "marginBottom": "50%" } }
            >
                <Row className="flex-grow-1 align-items-end">
                    <NiceContainer data="blue" className="mb-3">
                        <img alt="Qutex Logo" src="/logo.png" />
                    </NiceContainer>
                </Row>
                <Row className="justify-content-center">
                    { registerForm() }
                </Row>
                <Row className="justify-content-center">
                    <div>
                        <Button 
                            id="registerButton"
                            help="Register as New User to Qutex"
                            onClick={ onSubmit }
                            color="info"
                        >
                            Register
                        </Button>
                    </div>
                </Row>
            </NiceContainer>
        </Container>;

    if(loading) { 
        return <Spinner lg={ true } />;
    }

    return (
        <div className="main-panel white-content">
            { registerPage()}
        </div>
    );
};