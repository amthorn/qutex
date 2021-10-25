import { Home } from "views/Home";
import { Layout } from "components/layout/Layout";
import { Login } from "views/Auth/Login";
import { NotFoundPage }  from "views/Error";
import { Profile } from "views/User/Profile";
import { Project } from "views/Project/Project";
import { Projects } from "views/Project/Projects";
import React from "react";
import { Register } from "views/Auth/Register";
import { Statistics } from "views/Statistics/Statistics";
import { TokenVerify } from "views/Auth/TokenVerify";
import { Route, Switch } from "react-router-dom";


const layoutRender = component => properties => 
    <Layout component={ component } urlData={ component?.urlData } { ...properties } />;

const routes = [
    // Projects //
    { path: "/projects", exact: true, component: layoutRender(Projects) },
    { path: "/projects/:projectId(\\d+)", exact: true, component: layoutRender(Project) },

    // Statistics //
    { path: "/statistics", exact: true, component: layoutRender(Statistics) },

    // User //
    { path: "/user", exact: true, component: layoutRender(Profile) },

    // TODO: Authenticate/authorize //

    { path: "/", exact: true, component: layoutRender(Home) },
    { path: "/login", exact: true, component: Login },
    { path: "/register", exact: true, component: Register },
    { path: "/token_verify", exact: true, component: TokenVerify },
    { path: "*", component: () => <NotFoundPage />, status: 404 },
];

export const Routes = () => 
    <Switch>
        {
            routes.map(route => <Route key={ route.path } { ...route } /> )
        }
    </Switch>;