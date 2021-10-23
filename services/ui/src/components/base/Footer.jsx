import { FaHeart } from "react-icons/fa";
import React from "react";
import { Container, Nav, NavItem, NavLink } from "reactstrap";

const supportHref = "https://www.paypal.com/donate" + 
    "?business=" + 
    "W5AFLMVPNAXES" +
    "&item_name=" + 
    "Contributing+to+the+" + 
    "continued+development+" + 
    "of+my+work." +
    "&currency_code=USD";

const aboutMeHref = "https://www.linkedin.com/in/ava-thorn-384059135/";
const linkedinHref = "https://www.linkedin.com/in/ava-thorn-384059135/";
const Footer = () => 
    <footer className="footer pb-0">
        <Container fluid={ true }>
            <Nav>
                <NavItem>
                    <NavLink href={ supportHref } target="_blank">
                        Support Me
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink href={ aboutMeHref } target="_blank">
                        About Me
                    </NavLink>
                </NavItem>
            </Nav>
            <div className="copyright">
                © {new Date().getFullYear()} developed by{" "}
                <a
                    href={ linkedinHref }
                    target="_blank" rel="noreferrer"
                >
                    Ava Thorn <FaHeart />
                </a>
            </div>
        </Container>
    </footer>;

export default Footer;
