import express, { NextFunction, Request, Response, Router } from "express";
import morgan from "morgan";
interface PingResponse {
    message: string;
  }

  
export default function (router: Router){
	router.use(express.json());
    router.use(morgan("tiny"));
    router.use(express.static("./extensions/public"));
    // router.get("/")
} 