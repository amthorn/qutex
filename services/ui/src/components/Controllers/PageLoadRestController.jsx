import { useState, useEffect } from "react";
import { request } from "functions/request";
// import { Spinner } from "components/Components";
import startCase from "lodash/startCase";


export const PageLoadRestController = ({ url, method, children, setBreadcrumbs, notFound, setData, ...props }) => {

	const [fetching, setFetching] = useState(url !== undefined)
	const [notFoundState, setNotFoundState] = useState(false)

	const buildBreadCrumbs = () => {
		const pathList = window.location.pathname.split('/')

		let breadcrumbs = [];
		let route = "";

		if(["", "/"].includes(window.location.pathname)){
			breadcrumbs = [{name: "Home"}]
		}else{
			for(const i in pathList){
				route = [route === "/" ? "" : route, pathList[i]].join('/')
				breadcrumbs.push({
					name: pathList[i] === "" ? "Home" : startCase(pathList[i].toLowerCase()), 
					to: i < pathList.length - 1 ? route : null
				})
			}
		}
		return setBreadcrumbs(breadcrumbs);
	}

	useEffect(() => {
		if(url !== undefined){
			setFetching(true);
			request(url, {method: method}).then(({ response, data }) => {
				if (response.status === 404) {
					setNotFoundState(true);
				} else {
					setData(data.data[0]);
				}
				setFetching(false);
			});
		}
		buildBreadCrumbs();
	}, []);

	return fetching ? <Spinner color="primary" xl={true}/> : (notFound ? notFound() : children);
}