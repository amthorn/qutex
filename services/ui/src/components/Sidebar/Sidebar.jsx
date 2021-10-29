import env from "react-dotenv";
import { Nav } from "react-bootstrap";
import PerfectScrollbar from "perfect-scrollbar";
import { PropTypes } from "prop-types";
import React from "react";
import { useLocation } from "react-router-dom";
import { Alpha, ComingSoon } from "components/Components";


let ps;

const getTo = (property, loc) => {
    if(property.path.startsWith("/")){
        return property.path;
    }
    if(property.path.startsWith("https://")){
        return property.path;
    }
    return [loc.pathname, property.path].join("/");
};

export const Sidebar = ({ routes, logoElement, toggleSidebar, identity }) => {
    const location = useLocation(); // eslint-disable-line no-shadow
    const sidebarReference = React.useRef(null);
    let superAdmins = [];
    if(env){
        superAdmins = JSON.parse(env.SUPER_ADMINS);
    }

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
    }, []);

    const innerContent = (property) => 
        <div>
            { 
                React.isValidElement(property.icon) ?
                    property.icon :
                    <i className={ property.icon } />
            }
            { property.name }
            { property.comingSoon ? <ComingSoon /> : undefined }
            { property.alpha ? <Alpha /> : undefined }
        </div>;

    return (
        <div className="sidebar" data="blue">
            <div className="sidebar-wrapper" ref={ sidebarReference }>
                <div className="logo">
                    { logoElement }
                </div>
                <Nav>
                    { routes.map(property => <Nav.Item as="li" key={ property.path }>
                            <Nav.Link
                                href={ getTo(property, location) }
                                onClick={ toggleSidebar }
                                target={ property.path.startsWith("https://") ? "_blank": "_self" }
                            >
                                { innerContent(property) } 
                            </Nav.Link>
                        </Nav.Item>
                    ) }
                    {
                        identity.userId && superAdmins.includes(identity.userId) ?
                            <Nav.Item as="li" className="administration-nav-link">
                                <Nav.Link href="/admin">
                                    <i className="fa fa-user-o"/>
                                    <p>Administration</p>
                                </Nav.Link>
                            </Nav.Item> : undefined
                    } 
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
