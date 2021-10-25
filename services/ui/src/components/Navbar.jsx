// !
// 
// =========================================================
// Black Dashboard React v1.2.0
// =========================================================
// 
// Product Page: https://www.creative-tim.com/product/black-dashboard-react
// Copyright 2020 Creative Tim (https://www.creative-tim.com)
// Licensed under MIT (https://github.com/creativetimofficial/black-dashboard-react/blob/master/LICENSE.md)
// 
// Coded by Creative Tim
// 
// =========================================================
// 
// The above copyright notice and this permission notice shall be included in all 
// copies or substantial portions of the Software.
// 
// 
// nodejs library that concatenates classes
import classNames from "classnames/dedupe";
import { Link } from "react-router-dom";
import { logout } from "functions/auth";
import React from "react";
import { request } from "functions/request";
import {
    Breadcrumb,
    BreadcrumbItem,
    Container,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Input,
    Modal,
    ModalHeader,
    Nav,
    NavbarBrand,
    NavbarToggler,
    NavLink,
    Navbar as NvBr,
    Spinner,
    UncontrolledDropdown
} from "reactstrap";

const navBarStandardWidth = 993;

const getBreadcrumbs = (breadcrumbs) => 
    <Breadcrumb>
        {
            breadcrumbs.map(index => {
                let child;
                let key;

                if(index.to){
                    key = index.to;
                    child = <Link key={ key } active={ index.active } to={ index.to }>{ index.name }</Link>;
                }else{
                    key = "active";
                    child = <div key={ key }>{ index.name }</div>;
                }

                return <BreadcrumbItem key={ key }>{ child }</BreadcrumbItem>;
            })
        }
    </Breadcrumb>;

export const Navbar = ({ breadcrumbs, toggleSidebar, sidebarOpened, hstry }) => {
    const [collapseOpen, setcollapseOpen] = React.useState(false);
    const [modalSearch, setmodalSearch] = React.useState(false);
    const [color, setcolor] = React.useState("");
    const [fetching, setFetching] = React.useState(true);
    const [avatar, setAvatar] = React.useState("");

    // Function that adds color white/transparent to the navbar on resize (this is for the collapse)
    const updateColor = () => {
        if (window.innerWidth < navBarStandardWidth && collapseOpen) {
            setcolor("bg-white");
        } else {
            setcolor("navbar-transparent");
        }
    };

    React.useEffect(() => {
        window.addEventListener("resize", updateColor);


        // Specify how to clean up after this effect:
        return function cleanup() {
            window.removeEventListener("resize", updateColor);
        };
    });

    React.useEffect(() => {
        setFetching(true);
        request("/api/v1/users/me", {method: "GET"}).then(({ response, data }) => {
            if (response.status >= 200 && response.status < 300) { // eslint-disable-line no-magic-numbers
                setAvatar(data.data[0].avatar);
            }
            setFetching(false);
            return data;
        }).catch(alert);
    }, []);

    // This function opens and closes the collapse on small devices
    const toggleCollapse = () => {
        if (collapseOpen) {
            setcolor("navbar-transparent");
        } else {
            setcolor("bg-white");
        }

        setcollapseOpen(!collapseOpen);
    };

    // This function is to open the Search modal
    const toggleModalSearch = () => {
        setmodalSearch(!modalSearch);
    };

    return (
        <>
            <NvBr className={ classNames("fixed-top white-content", color) } expand="lg">
                <Container fluid={ true } className="px-0">
                    <div className="navbar-wrapper">
                        <div
                            className={ classNames("navbar-toggle d-inline w-100 h-100", {
                                toggled: sidebarOpened,
                            }) }
                        >
                            <NavbarToggler onClick={ toggleSidebar }>
                                <span className="navbar-toggler-bar bar1" />
                                <span className="navbar-toggler-bar bar2" />
                                <span className="navbar-toggler-bar bar3" />
                            </NavbarToggler>
                        </div>
                        <NavbarBrand href="#pablo" onClick={ (error) => error.preventDefault() }/>
                    </div>
                    <NavbarToggler onClick={ toggleCollapse }>
                        <span className="navbar-toggler-bar navbar-kebab" />
                        <span className="navbar-toggler-bar navbar-kebab" />
                        <span className="navbar-toggler-bar navbar-kebab" />
                    </NavbarToggler>
                    { breadcrumbs ? getBreadcrumbs(breadcrumbs) : undefined }
                    <Nav className="ml-auto" navbar={ true }>
                        <UncontrolledDropdown nav={ true }>
                            <DropdownToggle
                                caret={ true }
                                color="default"
                                nav={ true }
                                onClick={ (error) => error.preventDefault() }
                                style={ { color: "#1d253b" } }
                            >
                                <div className="photo">
                                    { fetching ? <Spinner/> : undefined }
                                    <img
                                        alt="..."
                                        src={ avatar }
                                    />
                                </div>
                                <p className="d-lg-none">Log out</p>
                            </DropdownToggle>
                            <DropdownMenu className="dropdown-navbar" right={ true } tag="ul">
                                <NavLink tag="li">
                                    <DropdownItem className="nav-item disabled">Profile</DropdownItem>
                                </NavLink>
                                <NavLink tag="li">
                                    <DropdownItem className="nav-item disabled">Settings</DropdownItem>
                                </NavLink>
                                <DropdownItem divider={ true } tag="li" />
                                <NavLink tag="li">
                                    <DropdownItem onClick={ () => {
                                        logout();
                                        hstry.push("/login");
                                    } } className="nav-item">Log out</DropdownItem>
                                </NavLink>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                        <li className="separator d-lg-none" />
                    </Nav>
                </Container>
            </NvBr>
            <Modal
                modalClassName="modal-search"
                isOpen={ modalSearch }
                toggle={ toggleModalSearch }
            >
                <ModalHeader>
                    <Input placeholder="SEARCH" type="text" />
                    <button
                        aria-label="Close"
                        className="close"
                        onClick={ toggleModalSearch }
                    >
                        <i className="tim-icons icon-simple-remove" />
                    </button>
                </ModalHeader>
            </Modal>
        </>
    );
};
