import puppeteer, { HTTPRequest } from "puppeteer";
import { CookieUtils, CookieOptions } from "./utils/cookies/CookieUtils";

(async () => {
  //   const file =
  //     "blob:https://courses.edx.org/83c8efe4-edc6-48fe-a828-58f57fb76d91";
  //   const path = "http://127.0.0.1:9222/json/version";
  //   const endpoint =
  //     "ws://127.0.0.1:9222/devtools/browser/24d3c3ea-271e-4dc2-8297-d9d937fccb1f";
  //   const browser = await puppeteer.connect({ browserWSEndpoint: endpoint });
  //   const page = await browser.newPage();

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setRequestInterception(true);

  await page.on("request", async (req: HTTPRequest) => {
    const cookieOptions: CookieOptions = {
      redirectLink:
        "https://learning.edx.org/course/course-v1:MITx+6.431x+1T2024/home",
      cookieToSearch: "edx-jwt-cookie-header-payload",
      filePath: "./cookies.json",
      page: page,
    };
    const cookieUtils = new CookieUtils(cookieOptions);
    const cookies = await page.cookies();

    await cookieUtils.applyCookiesFromRequest(cookies);
    req.continue();
  });

  await page.goto("https://authn.edx.org/login");
  await page.goto(
    "https://learning.edx.org/course/course-v1:MITx+6.431x+1T2024/home"
  );
  await page.goto(
    "blob:https://courses.edx.org/83c8efe4-edc6-48fe-a828-58f57fb76d91"
  );

  // blob:https://courses.edx.org/83c8efe4-edc6-48fe-a828-58f57fb76d91
})();
