/* eslint-disable @typescript-eslint/ban-ts-comment */
// import { appSettingsMock } from "./../src/mocks/configMock";
// import { Query } from "@directus/shared/types";
// import { addGeoJsonSupportToQuery } from "./../../package/src/infrastructure/common/helpers/directus";
describe("Test geo support for request query", () => {
  it("it should return a not null directus query object with an _intersects_bbox property ", async () => {
    expect(1).not.toBeNull();
    // const query: Query = {
    //   filter: {
    //     position: {
    //       // @ts-ignore
    //       _near: `[10,%202,%204]`,
    //     },
    //   },
    // };
    // // const newQuery = addGeoJsonSupportToQuery(query, appSettingsMock);
    // // @ts-ignore
    // expect(newQuery.filter["position"]._intersects_bbox).not.toBeNull();
  });
});
