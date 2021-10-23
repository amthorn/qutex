import { Nav } from "react-bootstrap";
import PerfectScrollbar from "perfect-scrollbar";
import { PropTypes } from "prop-types";
import React from "react";
import { NavLink as ReactstrapNavLink } from "reactstrap";
import { Alpha, ComingSoon } from "components/Components";
import { NavLink, useLocation } from "react-router-dom";

let ps;

const getTo = (property, location) => { // eslint-disable-line no-shadow
    if(property.path.startsWith("/")){
        return property.path;
    }
    if(property.path.startsWith("https://")){
        return {pathname: property.path};
    }
    return [location.pathname, property.path].join("/");
};

export const Sidebar = ({ routes, logoElement, toggleSidebar }) => {
    const location = useLocation(); // eslint-disable-line no-shadow
    const sidebarReference = React.useRef(null);

    // Verifies if routeName is the one active (in browser input)
    React.useEffect(() => {
        if (navigator.platform.includes("Win")) {
            ps = new PerfectScrollbar(sidebarReference.current, {
                suppressScrollX: true,
                suppressScrollY: false,
            });
        }


        // Specify how to clean up after this effect:
        return function cleanup() {
            if (navigator.platform.includes("Win")) {
                ps.destroy();
            }
        };
    });

    return (
        <div className="sidebar" data="blue">
            <div className="sidebar-wrapper" ref={ sidebarReference }>
                <div className="logo">
                    { logoElement }
                </div>
                <Nav>
                    { routes.map(property => !property.redirect ? <li key={ property.path }>
                            <NavLink
                                to={ getTo(property, location) }
                                className="nav-link"
                                activeClassName="active"
                                onClick={ toggleSidebar }
                                target={ property.path.startsWith("https://") ? "_blank": "_self" }
                            >
                                <div>
                                    { 
                                        React.isValidElement(property.icon) ?
                                            property.icon :
                                            <i className={ property.icon } />
                                    }
                                    { property.name }
                                    { property.coming_soon ? <ComingSoon /> : undefined }
                                    { property.alpha ? <Alpha /> : undefined }
                                </div>
                            </NavLink>
                        </li> : undefined
                    ) }
                    {<li className="administration-nav-link">
                        <ReactstrapNavLink href="/admin" className="disabled" active={ false }>
                            <i className="fa fa-user-o"/>
                            <p>Administration</p>
                        </ReactstrapNavLink>
                    </li>}
                </Nav>
            </div>
        </div>
    );
};

Sidebar.defaultProps = {
    routes: [{}],
};

Sidebar.propTypes = {
    // If true, then instead of the routes[i].name, routes[i].rtlName will be rendered
    // insde the links of this component
    routes: PropTypes.arrayOf(PropTypes.object)

};
