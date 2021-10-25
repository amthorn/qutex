import { request } from "functions/request";
import { Spinner } from "reactstrap";
import startCase from "lodash/startCase";
import React, { useEffect, useState } from "react";

const notFoundStatusCode = 404;

export const PageLoadRestController = ({ 
    url,
    children,
    setBreadcrumbs,
    setData
}) => {
    const [fetching, setFetching] = useState(url !== undefined);
    const [notFoundState, setNotFoundState] = useState(false);

    const buildBreadCrumbs = () => {
        const pathList = window.location.pathname.split("/");

        let breadcrumbs = [];
        let route = "";

        if(["", "/"].includes(window.location.pathname)){
            breadcrumbs = [{name: "Home"}];
        }else{
            for(let index=0; index < pathList.length; index++){
                route = [route === "/" ? "" : route, pathList[index]].join("/");
                breadcrumbs.push({
                    name: pathList[index] === "" ? "Home" : startCase(pathList[index].toLowerCase()), 
                    to: index < pathList.length - 1 ? route : undefined
                });
            }
        }
        return setBreadcrumbs(breadcrumbs);
    };

    useEffect(() => {
        if(url !== undefined){
            setFetching(true);
            request(url, {method: "GET"}).then(({ response, data }) => {
                if (response.status === notFoundStatusCode) {
                    setNotFoundState(true);
                } else {
                    setData(data.data[0]);
                }
                setFetching(false);
                return data;
            }).catch(alert);
        }
        buildBreadCrumbs();
    }, []);

    if(fetching){
        return <Spinner color="primary" xl={ true }/>;
    }
    if(notFoundState){
        return <div>Not Found</div>;
    }
    return children;
};