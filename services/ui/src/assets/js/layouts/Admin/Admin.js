// // !
// // 
// // =========================================================
// // Black Dashboard React v1.2.0
// // =========================================================
// // 
// // Product Page: https://www.creative-tim.com/product/black-dashboard-react
// // Copyright 2020 Creative Tim (https://www.creative-tim.com)
// // Licensed under MIT (https://github.com/creativetimofficial/black-dashboard-react/blob/master/LICENSE.md)
// // 
// // Coded by Creative Tim
// // 
// // =========================================================
// // 
// // The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// // 
// // 
// // javascript plugin used to create scrollbars on windows
// import PerfectScrollbar from "perfect-scrollbar";
// import React from "react";
// import { Redirect, Route, Switch, useLocation } from "react-router-dom";

// import logo from "../../assets/img/react-logo.png";
// import FixedPlugin from "../../components/FixedPlugin/FixedPlugin.js";
// import Footer from "../../components/Footer/Footer.js";
// // Core components
// import AdminNavbar from "../../components/Navbars/AdminNavbar.js";
// import Sidebar from "components/Sidebar";
// import routes from "../../routes.js";

// let ps;

// function Admin(properties) {
// 	const location = useLocation();
// 	const mainPanelReference = React.useRef(null);
// 	const [sidebarOpened, setsidebarOpened] = React.useState(
// 		document.documentElement.className.includes("nav-open")
// 	);

// 	React.useEffect(() => {
// 		if (navigator.platform.includes("Win")) {
// 			document.documentElement.className += " perfect-scrollbar-on";
// 			document.documentElement.classList.remove("perfect-scrollbar-off");
// 			ps = new PerfectScrollbar(mainPanelReference.current, {
// 				suppressScrollX: true,
// 			});

// 			const tables = document.querySelectorAll(".table-responsive");

// 			for (const table of tables) {
// 				ps = new PerfectScrollbar(table);
// 			}
// 		}


// 		// Specify how to clean up after this effect:
// 		return function cleanup() {
// 			if (navigator.platform.includes("Win")) {
// 				ps.destroy();
// 				document.documentElement.classList.add("perfect-scrollbar-off");
// 				document.documentElement.classList.remove("perfect-scrollbar-on");
// 			}
// 		};
// 	});
// 	React.useEffect(() => {
// 		if (navigator.platform.includes("Win")) {
// 			const tables = document.querySelectorAll(".table-responsive");

// 			for (const table of tables) {
// 				ps = new PerfectScrollbar(table);
// 			}
// 		}

// 		document.documentElement.scrollTop = 0;
// 		document.scrollingElement.scrollTop = 0;

// 		if (mainPanelReference.current) {
// 			mainPanelReference.current.scrollTop = 0;
// 		}
// 	}, [location]);


// 	// This function opens and closes the sidebar on small devices
// 	const toggleSidebar = () => {
// 		document.documentElement.classList.toggle("nav-open");
// 		setsidebarOpened(!sidebarOpened);
// 	};
// 	const getRoutes = (routes) => routes.map((property, key) => {
// 		if (property.layout === "/admin") {
// 			return (
// 				<Route
// 					path={property.layout + property.path}
// 					component={property.component}
// 					key={key}
// 				/>
// 			);
// 		}
 
// 		return null;
      
// 	});
// 	const getBrandText = (path) => {
// 		for (const route of routes) {
// 			if (location.pathname.includes(route.layout + route.path)) {
// 				return route.name;
// 			}
// 		}

// 		return "Brand";
// 	};

// 	return (
// 		<React.Fragment>
// 			<div className="wrapper">
// 				<Sidebar
// 					routes={routes}
// 					logo={{
// 						outterLink: "https://www.creative-tim.com/",
// 						text: "Creative Tim",
// 						imgSrc: logo,
// 					}}
// 					toggleSidebar={toggleSidebar}
// 				/>
// 				<div className="main-panel" ref={mainPanelReference} data="blue">
// 					<AdminNavbar
// 						brandText={getBrandText(location.pathname)}
// 						toggleSidebar={toggleSidebar}
// 						sidebarOpened={sidebarOpened}
// 					/>
// 					<Switch>
// 						{getRoutes(routes)}
// 						<Redirect from="*" to="/admin/dashboard" />
// 					</Switch>
// 					{

// 						// We don't want the Footer to be rendered on map page
// 						location.pathname === "/admin/maps" ? null : <Footer fluid={true} />
// 					}
// 				</div>
// 			</div>
// 			<FixedPlugin bgColor="blue" />
// 		</React.Fragment>
// 	);
// }

// export default Admin;

