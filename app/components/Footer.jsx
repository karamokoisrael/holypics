import React from "react";
// import styles from '../styles/Home.module.css'
import { ToastContainer, toast } from 'react-toastify';

const Footer = (props)=>{

    return (
    <React.Fragment>
            < br/>< br/>< br/>< br/>< br/>< br/>< br/>< br/>< br/>< br/>< br/>< br/>
            <a title='Back to top' className='scroll' 
               href="#top-bar">
                <icon className='arrow-up fa fa-arrow-up'></icon>
              </a>
            <div className="footer">
                <h3><marquee behavior="scroll" direction="left">Made by Karamoko Israel : <a href="https://megamaxdevelopment.tech">megamaxdevelopment</a></marquee></h3>
            </div>
   
    </React.Fragment>
    
    );
}

export default Footer;