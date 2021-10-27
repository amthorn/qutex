import React from "react";
import { request } from "functions/request";
import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    CardText,
    Col,
    Form,
    FormGroup,
    Input,
    Label,
    Row,
    Spinner
} from "reactstrap";

export const Profile = function() {
    const [fetching, setFetching] = React.useState(true);
    const [avatar, setAvatar] = React.useState("");

    React.useEffect(() => {
        setFetching(true);

        return request("/api/v1/users/me", {method: "GET"}).then(({ response, data }) => {
            if (response.status >= 200 && response.status < 300) { // eslint-disable-line no-magic-numbers
                setAvatar(data.data[0].avatar);
            }

            setFetching(false);

            return response;
        }).catch(() => {
            setFetching(false);
        });
    }, []);

    if(fetching) {
        return <Spinner lg={ true } />;
    }

    return (
        <Row>
            <Col md="8">
                <Card>
                    <CardHeader>
                        <h5 className="title">Edit Profile</h5>
                    </CardHeader>
                    <CardBody>
                        <Form>
                            <Row>
                                <Col className="pr-md-1" md="5">
                                    <FormGroup>
                                        <Label>Company (disabled)</Label>
                                        <Input
                                            defaultValue="Creative Code Inc."
                                            disabled={ true }
                                            placeholder="Company"
                                            type="text"
                                        />
                                    </FormGroup>
                                </Col>
                                <Col className="px-md-1" md="3">
                                    <FormGroup>
                                        <Label>Username</Label>
                                        <Input
                                            defaultValue="michael23"
                                            placeholder="Username"
                                            type="text"
                                        />
                                    </FormGroup>
                                </Col>
                                <Col className="pl-md-1" md="4">
                                    <FormGroup>
                                        <Label htmlFor="exampleInputEmail1">
                                            Email address
                                        </Label>
                                        <Input placeholder="mike@email.com" type="email" />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col className="pr-md-1" md="6">
                                    <FormGroup>
                                        <Label>First Name</Label>
                                        <Input
                                            defaultValue="Mike"
                                            placeholder="Company"
                                            type="text"
                                        />
                                    </FormGroup>
                                </Col>
                                <Col className="pl-md-1" md="6">
                                    <FormGroup>
                                        <Label>Last Name</Label>
                                        <Input
                                            defaultValue="Andrew"
                                            placeholder="Last Name"
                                            type="text"
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col md="12">
                                    <FormGroup>
                                        <Label>Address</Label>
                                        <Input
                                            defaultValue="Bld Mihail Kogalniceanu, nr. 8 Bl 1, Sc 1, Ap 09"
                                            placeholder="Home Address"
                                            type="text"
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col className="pr-md-1" md="4">
                                    <FormGroup>
                                        <Label>City</Label>
                                        <Input
                                            defaultValue="Mike"
                                            placeholder="City"
                                            type="text"
                                        />
                                    </FormGroup>
                                </Col>
                                <Col className="px-md-1" md="4">
                                    <FormGroup>
                                        <Label>Country</Label>
                                        <Input
                                            defaultValue="Andrew"
                                            placeholder="Country"
                                            type="text"
                                        />
                                    </FormGroup>
                                </Col>
                                <Col className="pl-md-1" md="4">
                                    <FormGroup>
                                        <Label>Postal Code</Label>
                                        <Input placeholder="ZIP Code" type="number" />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col md="8">
                                    <FormGroup>
                                        <Label>About Me</Label>
                                        <Input
                                            cols="80"
                                            defaultValue="Lamborghini Mercy, Your chick she so thirsty, I'm in
                        that two seat Lambo."
                                            placeholder="Here can be your description"
                                            rows="4"
                                            type="textarea"
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                        </Form>
                    </CardBody>
                    <CardFooter>
                        <Button className="btn-fill" color="primary" type="submit">
                            Save
                        </Button>
                    </CardFooter>
                </Card>
            </Col>
            <Col md="4">
                <Card className="card-user">
                    <CardBody>
                        <CardText />
                        <div className="author">
                            <div className="block block-one" />
                            <div className="block block-two" />
                            <div className="block block-three" />
                            <div className="block block-four" />
                            <a href="#pablo" onClick={ (error) => error.preventDefault() }>
                                <img
                                    alt="..."
                                    className="avatar"
                                    src={ avatar }
                                />
                                <h5 className="title">Mike Andrew</h5>
                            </a>
                            <p className="description">Ceo/Co-Founder</p>
                        </div>
                        <div className="card-description">
                            Do not be scared of the truth because we need to restart the
                            human foundation in truth And I love you like Kanye loves
                            Kanye I love Rick Owens’ bed design but the back is...
                        </div>
                    </CardBody>
                    <CardFooter>
                        <div className="button-container">
                            <Button className="btn-icon btn-round" color="facebook">
                                <i className="fab fa-facebook" />
                            </Button>
                            <Button className="btn-icon btn-round" color="twitter">
                                <i className="fab fa-twitter" />
                            </Button>
                            <Button className="btn-icon btn-round" color="google">
                                <i className="fab fa-google-plus" />
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            </Col>
        </Row>
    );
};
