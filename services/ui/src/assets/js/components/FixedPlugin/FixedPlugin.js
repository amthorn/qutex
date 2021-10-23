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
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// 
// 
import React from "react";

// Reactstrap components
import { Badge,Button, Dropdown, DropdownToggle } from "reactstrap";

import { ThemeContext, themes } from "../../contexts/ThemeContext.js";

function FixedPlugin(properties) {
	const [dropDownIsOpen, setdropDownIsOpen] = React.useState(false);
	const handleClick = () => {
		setdropDownIsOpen(!dropDownIsOpen);
	};

	return (
		<div className="fixed-plugin">
			<Dropdown isOpen={dropDownIsOpen} toggle={handleClick}>
				<DropdownToggle tag="div">
					<i className="fa fa-cog fa-2x" />
				</DropdownToggle>
				<ul className="dropdown-menu show">
					<li className="header-title">SIDEBAR BACKGROUND</li>
					<li className="adjustments-line text-center color-change">
						<ThemeContext.Consumer>
							{({ changeTheme }) => (
								<React.Fragment>
									<span className="color-label">LIGHT MODE</span>{" "}
									<Badge
										className="light-badge mr-2"
										onClick={() => changeTheme(themes.light)}
									/>{" "}
									<Badge
										className="dark-badge ml-2"
										onClick={() => changeTheme(themes.dark)}
									/>{" "}
									<span className="color-label">DARK MODE</span>{" "}
								</React.Fragment>
							)}
						</ThemeContext.Consumer>
					</li>
					<li className="button-container">
						<Button
							href="https://www.creative-tim.com/product/black-dashboard-react"
							color="primary"
							block={true}
							className="btn-round"
						>
              Download Now
						</Button>
						<Button
							color="default"
							block={true}
							className="btn-round"
							outline={true}
							href="https://demos.creative-tim.com/black-dashboard-react/#/documentation/tutorial"
						>
              Documentation
						</Button>
					</li>
					<li className="header-title">Want more components?</li>
					<li className="button-container">
						<Button
							href="https://www.creative-tim.com/product/black-dashboard-pro-react"
							className="btn-round"
							disabled={true}
							block={true}
							color="danger"
						>
              Get pro version
						</Button>
					</li>
				</ul>
			</Dropdown>
		</div>
	);
}

export default FixedPlugin;
