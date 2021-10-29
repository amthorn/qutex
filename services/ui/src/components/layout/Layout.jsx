import { authCheck } from "functions/auth";
import { NotFoundPage } from "views/Error";
import { PageLoadRestController } from "components/Controllers/PageLoadRestController";
import { Redirect } from "react-router-dom";
import { Spinner } from "components/base/BaseComponents";
import { themes } from "components/layout/ThemeContext";
import {
    Container,
    Footer,
    Navbar,
    NavSidebar,
    Row,
    ThemeContextWrapper,
} from "components/Components";
import React, { useEffect, useState } from "react";

const successStatusCode = 200;

export const Layout = ({ location, history, permission, ...props}) => { // eslint-disable-line no-shadow
    const [sidebarOpened, setSidebarOpened] = useState(false);
    const [notFound, setNotFound] = useState(false);
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);
    const [authorized, setAuthorized] = useState(false);
    const [breadcrumbs, setBreadcrumbs] = useState([]);
    const [pageData, setPageData] = useState();
    const [identity, setIdentity] = useState({});

    const toggleSidebar = () => {
        document.documentElement.classList.toggle("nav-open");
        setSidebarOpened(!sidebarOpened);
    };

    useEffect(() => {
        let isMounted = true;
        authCheck({ permission: undefined }).then(({response, data}) => {
            if(isMounted){
                setAuthenticated(response.status === successStatusCode && data.data.success === true);
                setIdentity(data.token);
                if (permission) {
                    authCheck({ permission }).then(({response, data}) => { // eslint-disable-line no-shadow
                        if(isMounted){
                            setAuthorized(response.status === successStatusCode && data.data.success === true);
                            setLoading(false);
                        }
                        return response;
                    }).catch(alert);
                } else {
                    setLoading(false);
                }
            }
            return response;
        }).catch(alert);
        return () => { isMounted = false; }
    }, []);

    const content = () => <>
        <Navbar 
            toggleSidebar={ toggleSidebar } 
            notFound={ () => setNotFound(true) }
            breadcrumbs={ breadcrumbs }
            history={ history }
        />
        <NavSidebar 
            identity={ identity }
            toggleSidebar={ toggleSidebar } 
            sidebarOpened={ sidebarOpened }
        />
        <div className="main-panel" data="blue">
            <Container className="content" fluid={ true }>
                <Row>
                        <PageLoadRestController 
                            url={ props.url }
                            setBreadcrumbs= { setBreadcrumbs } 
                            setData={ setPageData }
                        >
                        { React.createElement(props.component, { ...props, pageData, identity }) }
                    </PageLoadRestController>
                </Row>
                <Row className="flex-column">
                    <Footer />
                </Row>
            </Container>
        </div>
    </>;

    if(notFound){
        return <NotFoundPage />;
    }

    if (!authenticated && !loading) {
        return <Redirect to={ `/login?redirect=${encodeURIComponent(location.pathname)}` } />;
    }

    if (permission && !authorized && !loading) {
        return <Redirect to="/access_denied" />;
    }

    return <ThemeContextWrapper theme={ themes.light }>
        <div className="wrapper">
            { authenticated && !loading ? content() : <Spinner lg={ true }/> }
        </div>
    </ThemeContextWrapper>;
};