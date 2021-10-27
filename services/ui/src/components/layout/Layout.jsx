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

export const Layout = ({ location, history, ...props}) => { // eslint-disable-line no-shadow
    const [sidebarOpened, setSidebarOpened] = useState(false);
    const [notFound, setNotFound] = useState(false);
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);
    const [breadcrumbs, setBreadcrumbs] = useState([]);
    const [pageData, setPageData] = useState();
    const [identity, setIdentity] = useState({});

    const toggleSidebar = () => {
        document.documentElement.classList.toggle("nav-open");
        setSidebarOpened(!sidebarOpened);
    };

    useEffect(() => {
        setIdentity(authCheck().then(({response, data}) => {
            setAuthenticated(response.status === 200 && data.data.success === true);
            setLoading(false);
            setIdentity(data._token)
        }).catch(alert));
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

    return <ThemeContextWrapper theme={ themes.light }>
        <div className="wrapper">
            { authenticated && !loading ? content() : <Spinner lg={ true }/> }
        </div>
    </ThemeContextWrapper>;
};