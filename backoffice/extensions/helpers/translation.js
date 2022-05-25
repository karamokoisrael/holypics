"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// export const translate = async (key: string, lang: string, database?: Knex, req?: any, accessToken?: string, host?: string) => {
//     if(accessToken == undefined && database != undefined) {
//         const admTokenResults = await getAdminTokens(database);
//         accessToken = admTokenResults.access_token
//     }
//     if(req != undefined) host = getHost(req);
//     try {
//         const res = await fetch(`${host}/?fields[]=translation_strings&access_token=${accessToken}&limit=-1`)
//         const resJson = await res.json()
//         const translationData = resJson.data.translation_strings.filter((item: any)=> item.key == key.replace('$t:', ''))
//         return translationData[lang]
//     } catch (error) {
//         return key.replace(new RegExp(`_`,"g"), "")
//     }
// }
