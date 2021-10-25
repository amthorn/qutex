import { register } from "functions/auth";
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


export const TokenVerify = (props) => {
    const [loading, setLoading] = useState(false);
    const [code, setCode] = useState();
    const [password, setPassword] = useState();
    const [passwordVerify, setPasswordVerify] = useState();

    const onSubmit = () => {
        if(!code){
            toast.error("A Temporary Code must be provided.");
            return;
        }
        if(!password || !passwordVerify || password !== passwordVerify){
            toast.error("Passwords must both be provided and must match each other.");
            return;
        }
        setLoading(true);
        register(code, password).then(success => {
            setLoading(false);
            if (success) {
                // Reroute to set password page if password is not already set
                // Session cookie will be set.
                props.history.push("/");
            }
            return success;
        }).catch(alert);
    };

    const tokenVerifyForm = () => 
        <Form>
            <Form.Input
                placeholder="Enter Temporary Code"
                name="temporaryCodeInput"
                label="Temporary Code"
                invalid={ code === "" }
                feedbackMessage="A Temporary Code is required"
                onChange={ ({ target }) => { setCode(target.value); } }
            />
            <Form.Input
                placeholder="Enter Password"
                type="password"
                name="passwordInput" 
                label="Password"
                onChange={ ({ target }) => { setPassword(target.value); } }
                invalid={ password === "" }
                feedbackMessage="Password is required"
            />
            <Form.Input
                placeholder="Enter Password Again"
                type="password"
                name="passwordVerifyInput"
                label="Password (Verify)"
                invalid={ passwordVerify === "" || password !== passwordVerify }
                feedbackMessage="Password Verification is required and must match"
                onChange={ ({ target }) => { setPasswordVerify(target.value); } }
            />
        </Form>;

    const tokenVerifyPage = () => 
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
                    { tokenVerifyForm() }
                </Row>
                <Row className="justify-content-center">
                    <div>
                        <Button 
                            id="tokenVerifyButton"
                            help="Verify as New User to Qutex"
                            onClick={ onSubmit }
                            color="info"
                        >
                            Verify
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
            { tokenVerifyPage()}
        </div>
    );
};