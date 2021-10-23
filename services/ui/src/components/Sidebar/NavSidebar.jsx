import { Sidebar } from "./Sidebar";
import StretchSticky from "components/utilities/StretchSticky";
import React from "react";
import { Container, Row } from "react-bootstrap";
import { 
    FaAward,
    FaBook,
    FaChartBar,
    FaChartLine, 
    FaCheckCircle, 
    FaChess, 
    FaClipboardList, 
    FaClipboardCheck,
    FaComment, 
    FaCubes, 
    FaEdit,
    FaFileCode, 
    FaGithub,
    FaHistory, 
    FaHome, 
    FaLandmark,
    FaProjectDiagram, 
    FaSlidersH, 
    FaPlay 
} from "react-icons/fa";
import { Navigation } from "react-minimal-side-navigation";
import { withRouter } from "react-router-dom";
import Projects from "views/Project/Projects";

// Import 'react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css';

const navItems = {
    // TODO: authenticate admin appearance in sidebar:
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
            coming_soon: true

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
        {
            path: "/edit",
            name: "Edit",
            icon: <FaEdit size="20" className="sidenav-icon" />,
            coming_soon: true

            // Component: Dashboard,
            // layout: "/projects/:id/",
        },
        {
            path: "challenges",
            name: "Challenges",
            icon: <FaChess size="20" className="sidenav-icon" />,

            // Component: Dashboard,
            // layout: "/projects/:id/",
        },
        {
            path: "submissions",
            name: "Submissions",
            icon: <FaClipboardList size="20" className="sidenav-icon" />,
            coming_soon: true

            // Component: Dashboard,
            // layout: "/projects/:id/",
        },
        {
            path: "achievements",
            name: "Achievements",
            icon: <FaAward size="20" className="sidenav-icon" />,
            coming_soon: true

            // Component: Dashboard,
            // layout: "/projects/:id/achievements",
        },
        {
            path: "history",
            name: "History",
            icon: <FaHistory size="20" className="sidenav-icon" />,
            coming_soon: true

            // Component: Dashboard,
            // layout: "/projects/:id/",
        },
        {
            path: "metrics",
            name: "Metrics",
            icon: <FaChartLine size="20" className="sidenav-icon" />,
            coming_soon: true

            // Component: Dashboard,
            // layout: "/projects/:id/",
        },
        {
            path: "settings",
            name: "Settings",
            icon: <FaSlidersH size="20" className="sidenav-icon" />,
            coming_soon: true

            // Component: Dashboard,
            // layout: "/projects/:id/",
        },
    ],

    "^/projects/(\\d+)/challenges/(\\d+)$": [
        {
            path: "edit",
            name: "Edit",
            icon: <FaEdit size="20" className="sidenav-icon" />,
            coming_soon: true

            // Component: Dashboard,
            // layout: "/projects/:id/challenges/:id/",
        },
        {
            path: "solutions",
            name: "Solutions",
            icon: <FaCheckCircle size="20" className="sidenav-icon" />,
            coming_soon: true

            // Component: Dashboard,
            // layout: "/projects/:id/challenges/:id/",
        },
        {
            path: "submissions",
            name: "Submissions",
            icon: <FaClipboardList size="20" className="sidenav-icon" />

            // Component: Dashboard,
            // layout: "/projects/:id/",
        },
        {
            path: "comments",
            name: "Comments",
            icon: <FaComment size="20" className="sidenav-icon" />,
            coming_soon: true

            // Component: Dashboard,
            // layout: "/projects/:id/challenges/:id/comments",
        },
        {
            path: "rankings",
            name: "Rankings",
            icon: <FaLandmark size="20" className="sidenav-icon" />,
            coming_soon: true

            // Component: Dashboard,
            // layout: "/projects/:id/challenges/:id/",
        },
        {
            path: "metrics",
            name: "Metrics",
            icon: <FaChartBar size="20" className="sidenav-icon" />,
            coming_soon: true

            // Component: Dashboard,
            // layout: "/projects/:id/challenges/:id/",
        },
        {
            path: "history",
            name: "History",
            icon: <FaHistory size="20" className="sidenav-icon" />,
            coming_soon: true

            // Component: Dashboard,
            // layout: "/projects/:id/challenges/:id/",
        },
        {
            path: "settings",
            name: "Settings",
            icon: <FaSlidersH size="20" className="sidenav-icon" />,
            coming_soon: true

            // Component: Dashboard,
            // layout: "/projects/:id/challenges/:id/",
        },
    ],

    "^/projects/(\\d+)/challenges/(\\d+)/submissions/(\\d+)$": [
        {
            path: "runs",
            name: "Runs",
            icon: <FaPlay size="20" className="sidenav-icon" />

            // Component: Dashboard,
            // layout: "/projects/:id/challenges/:id/",
        },
        {
            path: "metrics",
            name: "Metrics",
            icon: <FaChartBar size="20" className="sidenav-icon" />,
            coming_soon: true

            // Component: Dashboard,
            // layout: "/projects/:id/challenges/:id/",
        },
        {
            path: "history",
            name: "History",
            icon: <FaHistory size="20" className="sidenav-icon" />,
            coming_soon: true

            // Component: Dashboard,
            // layout: "/projects/:id/challenges/:id/",
        }
    ],
    "^/projects/(\\d+)/challenges$": [
        /* TODO , nice circle notification next to this menu item if submissions need to be reviewed */
        {
            path: "submissions",
            name: "Submissions",
            icon: <FaClipboardList size="20" className="sidenav-icon" />,
            coming_soon: true

            // Component: Dashboard,
            // layout: "/projects/:id/challenges/:id/",
        },
        {
            path: "metrics",
            name: "Metrics",
            icon: <FaChartBar size="20" className="sidenav-icon" />,
            coming_soon: true

            // Component: Dashboard,
            // layout: "/projects/:id/challenges/:id/",
        },
    ],

    "/admin": [

    ]
};

export function getNavItems(path){
    for(const regex in navItems){
        if(new RegExp(regex).test(path)){
            return navItems[regex];
        }
    }
    return navItems["^/$"];
}

export const NavSidebar = withRouter(() => (
    <Sidebar 
        routes={ getNavItems(window.location.pathname) }
        logoElement={
            <a href="/"><img src="/logo.png" /></a>
        }
    />
));
