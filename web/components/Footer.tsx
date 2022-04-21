import React from "react";

const Footer = ()=>{

    return (
      <React.Fragment>
              <br/>< br/>< br/>< br/>< br/>< br/>< br/>< br/>< br/>< br/>< br/>< br/>
              <a title='Back to top' className='scroll' 
                href="#top-bar">
                  {/* @ts-ignore */}
                  <icon className='arrow-up fa fa-arrow-up'></icon>
                </a>
              <div className="footer">
                  {/* <h3><marquee behavior="scroll" direction="left">Made by Karamoko Israel : <a href="https://megamaxdevelopment.tech">megamaxdevelopment</a></marquee></h3> */}
              </div>
      </React.Fragment>
    );
}

export default Footer;