// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require("fs");

import { Response } from "express";

export const renderCustomPage = (
  res: Response,
  pageData: Record<string, any>
) => {
  fs.readFile(
    "./extensions/templates/html/custom-page-fr.html",
    "utf8",
    function (err: Error, html: string) {
      Object.keys(pageData).forEach((key) => {
        html = html.replace(new RegExp(`{{${key}}}`, "g"), pageData[key]);
      });
      res.send(html);
    }
  );
};
