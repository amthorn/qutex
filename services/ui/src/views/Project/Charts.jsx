/* eslint-disable */
// Nodejs library that concatenates classes
import classNames from "classnames/dedupe";
import React, { useState } from "react";
import { Bar,Line } from "react-chartjs-2";

// Reactstrap components
import {
    Button,
    ButtonGroup,
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    Col,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    FormGroup,
    Input,
    Label,
    Row,
    Table,
    UncontrolledDropdown,
    UncontrolledTooltip,
} from "reactstrap";

// ChartExample1 and chartExample2 options
const chart1_2_options = {
    maintainAspectRatio: false,

    legend: {
        display: false,
    },

    tooltips: {
        backgroundColor: "#f5f5f5",
        titleFontColor: "#333",
        bodyFontColor: "#666",
        bodySpacing: 4,
        xPadding: 12,
        mode: "nearest",
        intersect: 0,
        position: "nearest",
    },

    responsive: true,

    scales: {
        yAxes: [
            {
                barPercentage: 1.6,

                gridLines: {
                    drawBorder: false,
                    color: "rgba(29,140,248,0.0)",
                    zeroLineColor: "transparent",
                },

                ticks: {
                    suggestedMin: 60,
                    suggestedMax: 125,
                    padding: 20,
                    fontColor: "#9a9a9a",
                },
            },
        ],

        xAxes: [
            {
                barPercentage: 1.6,

                gridLines: {
                    drawBorder: false,
                    color: "rgba(29,140,248,0.1)",
                    zeroLineColor: "transparent",
                },

                ticks: {
                    padding: 20,
                    fontColor: "#9a9a9a",
                },
            },
        ],
    },
};

// #########################################
// // // used inside src/views/Dashboard.js
// #########################################
const chartExample1 = {
    data1(canvas) {
        const context_ = canvas.getContext("2d");

        const gradientStroke = context_.createLinearGradient(0, 230, 0, 50);

        gradientStroke.addColorStop(1, "rgba(29,140,248,0.2)");
        gradientStroke.addColorStop(0.4, "rgba(29,140,248,0.0)");
        gradientStroke.addColorStop(0, "rgba(29,140,248,0)"); // Blue colors

        return {
            labels: [
                "JAN",
                "FEB",
                "MAR",
                "APR",
                "MAY",
                "JUN",
                "JUL",
                "AUG",
                "SEP",
                "OCT",
                "NOV",
                "DEC",
            ],

            datasets: [
                {
                    label: "Qutex Fake Users",
                    fill: true,
                    backgroundColor: gradientStroke,
                    borderColor: "#1f8ef1",
                    borderWidth: 2,
                    borderDash: [],
                    borderDashOffset: 0,
                    pointBackgroundColor: "#1f8ef1",
                    pointBorderColor: "rgba(255,255,255,0)",
                    pointHoverBackgroundColor: "#1f8ef1",
                    pointBorderWidth: 20,
                    pointHoverRadius: 4,
                    pointHoverBorderWidth: 15,
                    pointRadius: 4,
                    data: [100, 70, 90, 70, 85, 60, 75, 60, 90, 80, 110, 100],
                },
            ],
        };
    },

    data2(canvas) {
        const context_ = canvas.getContext("2d");

        const gradientStroke = context_.createLinearGradient(0, 230, 0, 50);

        gradientStroke.addColorStop(1, "rgba(29,140,248,0.2)");
        gradientStroke.addColorStop(0.4, "rgba(29,140,248,0.0)");
        gradientStroke.addColorStop(0, "rgba(29,140,248,0)"); // Blue colors

        return {
            labels: [
                "JAN",
                "FEB",
                "MAR",
                "APR",
                "MAY",
                "JUN",
                "JUL",
                "AUG",
                "SEP",
                "OCT",
                "NOV",
                "DEC",
            ],

            datasets: [
                {
                    label: "Qutex Fake Users",
                    fill: true,
                    backgroundColor: gradientStroke,
                    borderColor: "#1f8ef1",
                    borderWidth: 2,
                    borderDash: [],
                    borderDashOffset: 0,
                    pointBackgroundColor: "#1f8ef1",
                    pointBorderColor: "rgba(255,255,255,0)",
                    pointHoverBackgroundColor: "#1f8ef1",
                    pointBorderWidth: 20,
                    pointHoverRadius: 4,
                    pointHoverBorderWidth: 15,
                    pointRadius: 4,
                    data: [80, 120, 105, 110, 95, 105, 90, 100, 80, 95, 70, 120],
                },
            ],
        };
    },

    data3(canvas) {
        const context_ = canvas.getContext("2d");

        const gradientStroke = context_.createLinearGradient(0, 230, 0, 50);

        gradientStroke.addColorStop(1, "rgba(29,140,248,0.2)");
        gradientStroke.addColorStop(0.4, "rgba(29,140,248,0.0)");
        gradientStroke.addColorStop(0, "rgba(29,140,248,0)"); // Blue colors

        return {
            labels: [
                "JAN",
                "FEB",
                "MAR",
                "APR",
                "MAY",
                "JUN",
                "JUL",
                "AUG",
                "SEP",
                "OCT",
                "NOV",
                "DEC",
            ],

            datasets: [
                {
                    label: "Qutex Fake Users",
                    fill: true,
                    backgroundColor: gradientStroke,
                    borderColor: "#1f8ef1",
                    borderWidth: 2,
                    borderDash: [],
                    borderDashOffset: 0,
                    pointBackgroundColor: "#1f8ef1",
                    pointBorderColor: "rgba(255,255,255,0)",
                    pointHoverBackgroundColor: "#1f8ef1",
                    pointBorderWidth: 20,
                    pointHoverRadius: 4,
                    pointHoverBorderWidth: 15,
                    pointRadius: 4,
                    data: [60, 80, 65, 130, 80, 105, 90, 130, 70, 115, 60, 130],
                },
            ],
        };
    },

    options: chart1_2_options,
};

// #########################################
// // // used inside src/views/Dashboard.js
// #########################################
const chartExample2 = {
    data(canvas) {
        const context_ = canvas.getContext("2d");

        const gradientStroke = context_.createLinearGradient(0, 230, 0, 50);

        gradientStroke.addColorStop(1, "rgba(29,140,248,0.2)");
        gradientStroke.addColorStop(0.4, "rgba(29,140,248,0.0)");
        gradientStroke.addColorStop(0, "rgba(29,140,248,0)"); // Blue colors

        return {
            labels: ["JUL", "AUG", "SEP", "OCT", "NOV", "DEC"],

            datasets: [
                {
                    label: "Data",
                    fill: true,
                    backgroundColor: gradientStroke,
                    borderColor: "#1f8ef1",
                    borderWidth: 2,
                    borderDash: [],
                    borderDashOffset: 0,
                    pointBackgroundColor: "#1f8ef1",
                    pointBorderColor: "rgba(255,255,255,0)",
                    pointHoverBackgroundColor: "#1f8ef1",
                    pointBorderWidth: 20,
                    pointHoverRadius: 4,
                    pointHoverBorderWidth: 15,
                    pointRadius: 4,
                    data: [80, 100, 70, 80, 120, 80],
                },
            ],
        };
    },

    options: chart1_2_options,
};

// #########################################
// // // used inside src/views/Dashboard.js
// #########################################
const chartExample3 = {
    data(canvas) {
        const context_ = canvas.getContext("2d");

        const gradientStroke = context_.createLinearGradient(0, 230, 0, 50);

        gradientStroke.addColorStop(1, "rgba(72,72,176,0.1)");
        gradientStroke.addColorStop(0.4, "rgba(72,72,176,0.0)");
        gradientStroke.addColorStop(0, "rgba(119,52,169,0)"); // Purple colors

        return {
            labels: ["USA", "GER", "AUS", "UK", "RO", "BR"],

            datasets: [
                {
                    label: "Countries",
                    fill: true,
                    backgroundColor: gradientStroke,
                    hoverBackgroundColor: gradientStroke,
                    borderColor: "#d048b6",
                    borderWidth: 2,
                    borderDash: [],
                    borderDashOffset: 0,
                    data: [53, 20, 10, 80, 100, 45],
                },
            ],
        };
    },

    options: {
        maintainAspectRatio: false,

        legend: {
            display: false,
        },

        tooltips: {
            backgroundColor: "#f5f5f5",
            titleFontColor: "#333",
            bodyFontColor: "#666",
            bodySpacing: 4,
            xPadding: 12,
            mode: "nearest",
            intersect: 0,
            position: "nearest",
        },

        responsive: true,

        scales: {
            yAxes: [
                {
                    gridLines: {
                        drawBorder: false,
                        color: "rgba(225,78,202,0.1)",
                        zeroLineColor: "transparent",
                    },

                    ticks: {
                        suggestedMin: 60,
                        suggestedMax: 120,
                        padding: 20,
                        fontColor: "#9e9e9e",
                    },
                },
            ],

            xAxes: [
                {
                    gridLines: {
                        drawBorder: false,
                        color: "rgba(225,78,202,0.1)",
                        zeroLineColor: "transparent",
                    },

                    ticks: {
                        padding: 20,
                        fontColor: "#9e9e9e",
                    },
                },
            ],
        },
    },
};

// #########################################
// // // used inside src/views/Dashboard.js
// #########################################
const chartExample4 = {
    data(canvas) {
        const context_ = canvas.getContext("2d");

        const gradientStroke = context_.createLinearGradient(0, 230, 0, 50);

        gradientStroke.addColorStop(1, "rgba(66,134,121,0.15)");
        gradientStroke.addColorStop(0.4, "rgba(66,134,121,0.0)"); // Green colors
        gradientStroke.addColorStop(0, "rgba(66,134,121,0)"); // Green colors

        return {
            labels: ["JUL", "AUG", "SEP", "OCT", "NOV"],

            datasets: [
                {
                    label: "My First dataset",
                    fill: true,
                    backgroundColor: gradientStroke,
                    borderColor: "#00d6b4",
                    borderWidth: 2,
                    borderDash: [],
                    borderDashOffset: 0,
                    pointBackgroundColor: "#00d6b4",
                    pointBorderColor: "rgba(255,255,255,0)",
                    pointHoverBackgroundColor: "#00d6b4",
                    pointBorderWidth: 20,
                    pointHoverRadius: 4,
                    pointHoverBorderWidth: 15,
                    pointRadius: 4,
                    data: [90, 27, 60, 12, 80],
                },
            ],
        };
    },

    options: {
        maintainAspectRatio: false,

        legend: {
            display: false,
        },

        tooltips: {
            backgroundColor: "#f5f5f5",
            titleFontColor: "#333",
            bodyFontColor: "#666",
            bodySpacing: 4,
            xPadding: 12,
            mode: "nearest",
            intersect: 0,
            position: "nearest",
        },

        responsive: true,

        scales: {
            yAxes: [
                {
                    barPercentage: 1.6,

                    gridLines: {
                        drawBorder: false,
                        color: "rgba(29,140,248,0.0)",
                        zeroLineColor: "transparent",
                    },

                    ticks: {
                        suggestedMin: 50,
                        suggestedMax: 125,
                        padding: 20,
                        fontColor: "#9e9e9e",
                    },
                },
            ],

            xAxes: [
                {
                    barPercentage: 1.6,

                    gridLines: {
                        drawBorder: false,
                        color: "rgba(0,242,195,0.1)",
                        zeroLineColor: "transparent",
                    },

                    ticks: {
                        padding: 20,
                        fontColor: "#9e9e9e",
                    },
                },
            ],
        },
    },
};


export var ProjectChart = function({ project }) {
    const [bigChartData, setbigChartData] = React.useState("data1");
    const setBgChartData = (name) => {
        setbigChartData(name);
    };

    return (
        <Card className="card-chart">
            <CardHeader>
                <Row>
                    <Col className="text-left" sm="6">
                        <h5 className="card-category">Project { project.name }</h5>
                        <CardTitle tag="h2">Activity</CardTitle>
                    </Col>
                    <Col sm="6">
                        <ButtonGroup
                            className="btn-group-toggle float-right"
                            data-toggle="buttons"
                        >
                            <Button
                                tag="label"
                                className={ classNames("btn-simple", {
                                    active: bigChartData === "data1",
                                }) }
                                color="info"
                                id="0"
                                size="sm"
                                onClick={ () => setBgChartData("data1") }
                            >
                                <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                                    Challenges
                                </span>
                                <span className="d-block d-sm-none">
                                    <i className="tim-icons icon-single-02" />
                                </span>
                            </Button>
                            <Button
                                color="info"
                                id="1"
                                size="sm"
                                tag="label"
                                className={ classNames("btn-simple", {
                                    active: bigChartData === "data2",
                                }) }
                                onClick={ () => setBgChartData("data2") }
                            >
                                <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                                    Submissions
                                </span>
                                <span className="d-block d-sm-none">
                                    <i className="tim-icons icon-gift-2" />
                                </span>
                            </Button>
                            <Button
                                color="info"
                                id="2"
                                size="sm"
                                tag="label"
                                className={ classNames("btn-simple", {
                                    active: bigChartData === "data3",
                                }) }
                                onClick={ () => setBgChartData("data3") }
                            >
                                <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                                    Solutions
                                </span>
                                <span className="d-block d-sm-none">
                                    <i className="tim-icons icon-tap-02" />
                                </span>
                            </Button>
                        </ButtonGroup>
                    </Col>
                </Row>
            </CardHeader>
            <CardBody>
                <div className="chart-area">
                    <Line
                        data={ chartExample1[bigChartData] }
                        options={ chartExample1.options }
                    />
                </div>
            </CardBody>
        </Card>

    );
};
export var ProjectChart2 = function() {
    return (

        <Row>
            <Col lg="6" md="12">
                <Card className="card-tasks">
                    <CardHeader>
                        <h6 className="title d-inline">Tasks(5)</h6>
                        <p className="card-category d-inline"> today</p>
                        <UncontrolledDropdown>
                            <DropdownToggle
                                caret={ true }
                                className="btn-icon"
                                color="link"
                                data-toggle="dropdown"
                                type="button"
                            >
                                <i className="tim-icons icon-settings-gear-63" />
                            </DropdownToggle>
                            <DropdownMenu aria-labelledby="dropdownMenuLink" right={ true }>
                                <DropdownItem
                                    href="#pablo"
                                    onClick={ (e) => e.preventDefault() }
                                >
                                    Action
                                </DropdownItem>
                                <DropdownItem
                                    href="#pablo"
                                    onClick={ (e) => e.preventDefault() }
                                >
                                    Another action
                                </DropdownItem>
                                <DropdownItem
                                    href="#pablo"
                                    onClick={ (e) => e.preventDefault() }
                                >
                                    Something else
                                </DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                    </CardHeader>
                    <CardBody>
                        <div className="table-full-width table-responsive">
                            <Table>
                                <tbody>
                                    <tr>
                                        <td>
                                            <FormGroup check={ true }>
                                                <Label check={ true }>
                                                    <Input defaultValue="" type="checkbox" />
                                                    <span className="form-check-sign">
                                                        <span className="check" />
                                                    </span>
                                                </Label>
                                            </FormGroup>
                                        </td>
                                        <td>
                                            <p className="title">Review Challenge "List Challenge" Submission</p>
                                            <p className="text-muted">
                                                Dakota Rice, 8:47 AM, 10 out of 12 validations passed
                                            </p>
                                        </td>
                                        <td className="td-actions text-right">
                                            <Button
                                                color="link"
                                                id="tooltip636901683"
                                                title=""
                                                type="button"
                                            >
                                                <i className="tim-icons icon-pencil" />
                                            </Button>
                                            <UncontrolledTooltip
                                                delay={ 0 }
                                                target="tooltip636901683"
                                                placement="right"
                                            >
                                                Edit Task
                                            </UncontrolledTooltip>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <FormGroup check={ true }>
                                                <Label check={ true }>
                                                    <Input
                                                        defaultChecked={ true }
                                                        defaultValue=""
                                                        type="checkbox"
                                                    />
                                                    <span className="form-check-sign">
                                                        <span className="check" />
                                                    </span>
                                                </Label>
                                            </FormGroup>
                                        </td>
                                        <td>
                                            <p className="title">New Achievement</p>
                                            <p className="text-muted">
                                                100 Challenges Created!
                                            </p>
                                        </td>
                                        <td className="td-actions text-right">
                                            <Button
                                                color="link"
                                                id="tooltip457194718"
                                                title=""
                                                type="button"
                                            >
                                                <i className="tim-icons icon-pencil" />
                                            </Button>
                                            <UncontrolledTooltip
                                                delay={ 0 }
                                                target="tooltip457194718"
                                                placement="right"
                                            >
                                                Edit Task
                                            </UncontrolledTooltip>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <FormGroup check={ true }>
                                                <Label check={ true }>
                                                    <Input defaultValue="" type="checkbox" />
                                                    <span className="form-check-sign">
                                                        <span className="check" />
                                                    </span>
                                                </Label>
                                            </FormGroup>
                                        </td>
                                        <td>
                                            <p className="title">Solve the issues</p>
                                            <p className="text-muted">
                                                Fifty percent of all respondents said they would be
                                                more likely to shop at a company
                                            </p>
                                        </td>
                                        <td className="td-actions text-right">
                                            <Button
                                                color="link"
                                                id="tooltip362404923"
                                                title=""
                                                type="button"
                                            >
                                                <i className="tim-icons icon-pencil" />
                                            </Button>
                                            <UncontrolledTooltip
                                                delay={ 0 }
                                                target="tooltip362404923"
                                                placement="right"
                                            >
                                                Edit Task
                                            </UncontrolledTooltip>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <FormGroup check={ true }>
                                                <Label check={ true }>
                                                    <Input defaultValue="" type="checkbox" />
                                                    <span className="form-check-sign">
                                                        <span className="check" />
                                                    </span>
                                                </Label>
                                            </FormGroup>
                                        </td>
                                        <td>
                                            <p className="title">Release v2.0.0</p>
                                            <p className="text-muted">
                                                Ra Ave SW, Seattle, WA 98116, SUA 11:19 AM
                                            </p>
                                        </td>
                                        <td className="td-actions text-right">
                                            <Button
                                                color="link"
                                                id="tooltip818217463"
                                                title=""
                                                type="button"
                                            >
                                                <i className="tim-icons icon-pencil" />
                                            </Button>
                                            <UncontrolledTooltip
                                                delay={ 0 }
                                                target="tooltip818217463"
                                                placement="right"
                                            >
                                                Edit Task
                                            </UncontrolledTooltip>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <FormGroup check={ true }>
                                                <Label check={ true }>
                                                    <Input defaultValue="" type="checkbox" />
                                                    <span className="form-check-sign">
                                                        <span className="check" />
                                                    </span>
                                                </Label>
                                            </FormGroup>
                                        </td>
                                        <td>
                                            <p className="title">Export the processed files</p>
                                            <p className="text-muted">
                                                The report also shows that consumers will not easily
                                                forgive a company once a breach exposing their
                                                personal data occurs.
                                            </p>
                                        </td>
                                        <td className="td-actions text-right">
                                            <Button
                                                color="link"
                                                id="tooltip831835125"
                                                title=""
                                                type="button"
                                            >
                                                <i className="tim-icons icon-pencil" />
                                            </Button>
                                            <UncontrolledTooltip
                                                delay={ 0 }
                                                target="tooltip831835125"
                                                placement="right"
                                            >
                                                Edit Task
                                            </UncontrolledTooltip>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <FormGroup check={ true }>
                                                <Label check={ true }>
                                                    <Input defaultValue="" type="checkbox" />
                                                    <span className="form-check-sign">
                                                        <span className="check" />
                                                    </span>
                                                </Label>
                                            </FormGroup>
                                        </td>
                                        <td>
                                            <p className="title">Arival at export process</p>
                                            <p className="text-muted">
                                                Capitol Hill, Seattle, WA 12:34 AM
                                            </p>
                                        </td>
                                        <td className="td-actions text-right">
                                            <Button
                                                color="link"
                                                id="tooltip217595172"
                                                title=""
                                                type="button"
                                            >
                                                <i className="tim-icons icon-pencil" />
                                            </Button>
                                            <UncontrolledTooltip
                                                delay={ 0 }
                                                target="tooltip217595172"
                                                placement="right"
                                            >
                                                Edit Task
                                            </UncontrolledTooltip>
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>
                        </div>
                    </CardBody>
                </Card>
            </Col>
            <Col lg="6" md="12">
                <Card>
                    <CardHeader>
                        <CardTitle tag="h4">Recent Submitters</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <Table className="tablesorter" responsive={ true }>
                            <thead className="text-primary">
                                <tr>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>Area of Expertise</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Dakota Rice</td>
                                    <td>Niger</td>
                                    <td>Python</td>
                                </tr>
                                <tr>
                                    <td>Minerva Hooper</td>
                                    <td>Curaçao</td>
                                    <td>Docker</td>
                                </tr>
                                <tr>
                                    <td>Sage Rodriguez</td>
                                    <td>Netherlands</td>
                                    <td>Devops</td>
                                </tr>
                                <tr>
                                    <td>Philip Chaney</td>
                                    <td>Korea, South</td>
                                    <td>Java, Python</td>
                                </tr>
                                <tr>
                                    <td>Doris Greene</td>
                                    <td>Malawi</td>
                                    <td>Golang</td>
                                </tr>
                                <tr>
                                    <td>Mason Porter</td>
                                    <td>Chile</td>
                                    <td>HTML, CSS, JS</td>
                                </tr>
                                <tr>
                                    <td>Jon Porter</td>
                                    <td>Portugal</td>
                                    <td>Printers</td>
                                </tr>
                                <tr>
                                    <td>Jon Porter</td>
                                    <td>Portugal</td>
                                    <td>Printers</td>
                                </tr>
                                <tr>
                                    <td>Jon Porter</td>
                                    <td>Portugal</td>
                                    <td>Printers</td>
                                </tr>
                                <tr>
                                    <td>Jon Porter</td>
                                    <td>Portugal</td>
                                    <td>Printers</td>
                                </tr>
                                <tr>
                                    <td>Jon Porter</td>
                                    <td>Portugal</td>
                                    <td>Printers</td>
                                </tr>
                                <tr>
                                    <td>Jon Porter</td>
                                    <td>Portugal</td>
                                    <td>Printers</td>
                                </tr>
                                <tr>
                                    <td>Jon Porter</td>
                                    <td>Portugal</td>
                                    <td>Printers</td>
                                </tr>
                                <tr>
                                    <td>Jon Porter</td>
                                    <td>Portugal</td>
                                    <td>Printers</td>
                                </tr>
                                <tr>
                                    <td>Jon Porter</td>
                                    <td>Portugal</td>
                                    <td>Printers</td>
                                </tr>
                                <tr>
                                    <td>Jon Porter</td>
                                    <td>Portugal</td>
                                    <td>Printers</td>
                                </tr>
                            </tbody>
                        </Table>
                    </CardBody>
                </Card>
            </Col>
        </Row>
    );
};

export {
  chartExample1, // in src/views/Dashboard.js
  chartExample2, // in src/views/Dashboard.js
  chartExample3, // in src/views/Dashboard.js
  chartExample4, // in src/views/Dashboard.js
};