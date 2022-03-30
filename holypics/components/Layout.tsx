import React, { Fragment } from "react";
import Footer from "./Footer";
import Header from "./Header";
type Props = {
    title?: string,
    children: JSX.Element,
};

const Layout = ({ title, children }: Props) => {
    return(
        <Fragment>
            <Header/>
            {children}
            <Footer/>
        </Fragment>
    ) 
};

export default Layout;

