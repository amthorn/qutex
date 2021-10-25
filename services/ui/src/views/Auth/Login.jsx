import { login } from "functions/auth";
import queryString from "query-string";
import { 
    Button,
    Container, 
    Form, 
    NiceContainer, 
    Row,
    Spinner
} from "components/Components";
import React, { useState } from "react";


export const Login = (props) => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    const onSubmit = () => {
        setLoading(true);
        login(email, password).then(success => {
            setLoading(false);
            if(success){
                props.history.push(queryString.parse(props.location.search).redirect || "/");
            }
            return success;
        }).catch(alert);
    };

    const loginForm = () =>
        <Form>
            <Form.Input
                placeholder="Enter Email"
                name="emailInput" 
                label="Email"
                onChange={ ({ target }) => { setEmail(target.value); } }
                invalid={ email === "" }
                feedbackMessage="Email is required"
            />
            <Form.Input
                placeholder="Enter Password"
                type="password"
                name="passwordInput"
                label="Password"
                invalid={ password === "" }
                feedbackMessage="Password is required"
                onChange={ ({ target }) => { setPassword(target.value); } }
            />
            <a href="/register">First time here? Create a New Account!</a>
        </Form>;

    const loginPage = () =>
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
                    { loginForm() }
                </Row>
                <Row className="justify-content-center">
                    <div>
                        <Button 
                            id="loginButton"
                            help="Login to Qutex"
                            onClick={ onSubmit }
                            color="info"
                        >
                            Login
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
            { loginPage() }
        </div>
    );
};