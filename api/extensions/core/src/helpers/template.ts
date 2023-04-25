/* eslint-disable @typescript-eslint/no-var-requires */
import { getHost } from "./utils";
import { AppSettings } from "./../@types/global";
import { Liquid } from "liquidjs";
import { Response, Request } from "express";
import { throwViewError } from "./exceptions";
import { Knex } from "knex";
import { isValidURL } from "./validation";
import { v4 } from "uuid";
const fs = require("fs");
const ejs = require("ejs");
type templateValue = {
  textData: string;
  error: Error;
};

export const getTemplate = (
  fileName: string,
  callback: (data: any) => void
) => {
  fs.readFile(
    `./extensions/templates/${fileName}`,
    "utf8",
    function (error: Error, textData: string) {
      callback({ textData: textData, error: error });
    }
  );
};

export const renderTemplate = async (
  req: Request,
  res: Response,
  data: Record<string, any> = {},
  fileName = "default",
  type = "html",
  lang = "intl",
  database: Knex | null = null
) => {
  const nonce = v4();
  if (database != null) {
    const [settings] = await database("directus_settings");
    const [appSettings] = await database<AppSettings>("configurations");

    data = {
      ...settings,
      ...appSettings,
      project_url:
        process.env.NODE_ENV != "production" ||
        settings.project_url != null ||
        settings.project_url != undefined ||
        !isValidURL(settings.project_url)
          ? getHost(req)
          : settings.project_url,
      ...data,
    };
  }
  data.nonce = nonce;

  getTemplate(
    `${type}/${lang}/${fileName}.${type}`,
    async ({ textData, error }: templateValue) => {
      let unexpectedError = false;
      try {
        switch (type) {
          case "liquid":
            // eslint-disable-next-line no-case-declarations
            const engine = new Liquid();
            // eslint-disable-next-line no-case-declarations
            const tpl = engine.parse(textData);
            try {
              textData = await engine.render(tpl, data);
            } catch (error) {
              throwViewError(req, res, lang);
            }
            break;
          case "ejs":
            textData = ejs.render(textData, data);
            break;
          default:
            Object.keys(data).forEach((key) => {
              textData = textData
                .replace(new RegExp(`{{${key}}}`, "g"), data[key])
                .replace(new RegExp(`{{ ${key} }}`, "g"), data[key]);
            });
            break;
        }

        if (textData != null && textData != undefined) {
          res.header("Content-Type", "text/html");
          res.header(
            "Content-Security-Policy",
            `script-src 'self' 'unsafe-inline' 'unsafe-eval'`
          );
          res.send(textData);
        } else {
          unexpectedError = true;
        }
      } catch (error) {
        console.log(error);

        unexpectedError = true;
      }

      if (unexpectedError) {
        throwViewError(req, res, lang);
      }
    }
  );
};
