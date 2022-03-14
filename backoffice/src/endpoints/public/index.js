
const express = require("express")
const customExceptions = require("../../helpers/exceptions");

module.exports =  (router, { services, exceptions, getSchema }) => {
	router.use("/static", express.static('./extensions/static')); 
};
