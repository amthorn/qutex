import React from "react";
import { Sidebar } from "components/Sidebar/Sidebar";
import { withRouter } from "react-router-dom";
import {
    FaBook,
    FaClipboardCheck,
    FaCubes, 
    FaGithub,
    FaProjectDiagram,
} from "react-icons/fa";

// Import 'react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css';

const navItems = {
    // TODO: authenticate admin appearance in sidebar
    "^/$": [
        {
            path: "/projects",
            name: "Projects",
            icon: <FaProjectDiagram size="20" className="sidenav-icon" />,
            alpha: true

            // Component: Projects,
            // layout: "/projects",
        },
        {
            path: "/statistics",
            name: "Statistcs",
            icon: <FaCubes size="20" className="sidenav-icon" />,
            comingSoon: true

            // Component: Dashboard,
            // layout: "/",
        },
        {
            path: "https://docs.qutexbot.com",
            name: "Documentation",
            icon: <FaBook size="20" className="sidenav-icon" />,

            // Component: Dashboard,
            // layout: "/",
        },
        {
            path: "https://www.github.com/amthorn/qutex",
            name: "Repository",
            icon: <FaGithub size="20" className="sidenav-icon" />,

            // Component: Dashboard,
            // layout: "/",
        },
        {
            path: "https://stats.uptimerobot.com/8KPxytXOlK",
            name: "Status",
            icon: <FaClipboardCheck size="20" className="sidenav-icon" />,

            // Component: Dashboard,
            // layout: "/",
        },
        {
            path: "https://apphub.webex.com/applications/qutex-qutex",
            name: "Webex AppHub Listing",
            icon: <FaCubes size="20" className="sidenav-icon" />,

            // Component: Dashboard,
            // layout: "/",
        },
    ],

    "^/projects/(\\d+)$": [
        
    ],

    "^/projects/(\\d+)/queues/(\\d+)$": [
        
    ],

    "/admin": [

    ]
};

const getNavItems = (path) => {
    for(const regex in navItems){
        if(new RegExp(regex, "u").test(path)){
            return navItems[regex];
        }
    }
    return navItems["^/$"];
};

const NavSidebar = withRouter(({ ...props }) => {
    return <Sidebar 
        { ...props }
        routes={ getNavItems(window.location.pathname) }
        logoElement={
            <a href="/"><img alt="Qutex Logo" src="/logo.png" /></a>
        }
    />
});

export {
    getNavItems,
    NavSidebar
};