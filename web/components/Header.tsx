import React from "react";
import Head from 'next/head'
import { ToastContainer, toast } from 'react-toastify';
import Link from "next/link";

const Header = (props: Record<string, any>)=>{

    const navLinks = [
        {
            name: "Home",
            displayName: "Home",
            link: "",
            key: 1
        },
        {
            name: "Test",
            displayName: "Test Image",
            link: "test",
            key: 2
        },
        {
            name: "Doc",
            displayName: "Documentation",
            link: process.env.DOCS_URL,
            key: 3
        },
        
        // {
        //     name: "TestVideo",
        //     displayName: "Test Videos",
        //     link: "test-video",
        //     key: 3
        // }
    ]

    const renderNavLinks = (navLink: Record<string, any>)=>(
        <li className="nav-item" key={navLink.key} >
            <Link href={navLink.link.includes("http") ? navLink.link : '/'+navLink.link}>
                <a href={navLink.link.includes("http") ? navLink.link : "#"}
                    // onClick={()=>{router.push('/'+navLink.link, undefined, { shallow: true })}} 
                    key={navLink.key} className={`nav-link${props.currentNav == navLink.name ? "active": ""}`} aria-current="page">{navLink.displayName}</a>
            </Link>
        </li>
    );
    return (
        <React.Fragment>
            <div>
                <Head>
                    <title>{props.title!=undefined ? props.title : "holypics beta test"}</title>
                    <meta name="description" content="Created by karamoko israel" />
                    <link rel="icon" href="/favicon.ico" />
                    <link
                        href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css" rel="stylesheet"
                        integrity="sha384-giJF6kkoqNQ00vy+HMDP7azOuL0xtbfIcaT9wjKHr8RbDVddVHyTfAAsrekwKmP1"
                        crossOrigin="anonymous" 
                        />
                        <script
                        src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/js/bootstrap.bundle.min.js"
                        integrity="sha384-ygbV9kiqUc6oa4msXn9868pTtWMgiQaeYH7/t7LECLbyPA2x65Kgf80OJFdroafW"
                        crossOrigin="anonymous"></script>
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" integrity="sha512-iBBXm8fW90+nuLcSKlbmrPcLa0OT92xO1BIsZ+ywDWZCvqsWgccV3gFoRBv0z+8dLJgyAHIhR35VZc2oM/gI1w==" crossOrigin="anonymous"/>
                    <script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/js/all.min.js" integrity="sha512-RXf+QSDCUQs5uwRKaDoXt55jygZZm2V++WUZduaU/Ui/9EGp3f/2KZVahFZBKGH0s774sd3HmrhUy+SgOFQLVQ==" crossOrigin="anonymous"></script>
                </Head>
            </div>
            <nav className="navbar navbar-expand-lg navbar-light bg-light" id="top-bar">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">Holypics</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        
                        {navLinks.map(renderNavLinks)}
                        
                    </ul>
                    </div>
                </div>
            </nav>    
            <div className="own-toaster">
                <ToastContainer />
            </div>
        </React.Fragment>
    );
}

export default Header;