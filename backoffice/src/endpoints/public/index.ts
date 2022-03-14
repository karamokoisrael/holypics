import express, { Router } from "express";

module.exports =  (router: Router) => {
	router.use("/static", express.static('./extensions/static')); 
};
