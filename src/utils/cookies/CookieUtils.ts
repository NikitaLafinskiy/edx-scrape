import { Cookie, Page } from "puppeteer";
import { readFile, writeFile } from "fs/promises";

export interface CookieOptions {
  page: Page;
  filePath: string;
  cookieToSearch: string;
  redirectLink: string;
}

export class CookieUtils {
  page: Page;
  filePath: string;
  cookieToSearch: string;
  redirectLink: string;

  constructor({ page, filePath, cookieToSearch, redirectLink }: CookieOptions) {
    this.page = page;
    this.filePath = filePath;
    this.cookieToSearch = cookieToSearch;
    this.redirectLink = redirectLink;
  }

  private async checkCookieFile() {
    const data = await readFile(this.filePath, "utf8");
    const cookieJson = JSON.parse(data);
    if (cookieJson.length > 0) {
      return true;
    }
    return false;
  }

  private searchCookies(cookies: Cookie[]) {
    for (let i = 0; i < cookies.length; i++) {
      if (cookies[i].name === this.cookieToSearch) {
        return true;
      }
    }

    return false;
  }

  private async writeCookies(cookies: Cookie[]) {
    console.log("writing to the cookies file");
    const cookieJson = JSON.stringify(cookies);
    await writeFile(this.filePath, cookieJson);
  }

  private async useCookies() {
    const cookiesJson = await readFile(this.filePath, "utf8");
    const cookiesArr = JSON.parse(cookiesJson);
    await this.page.setCookie(...cookiesArr);
  }

  async applyCookiesFromRequest(cookies: Cookie[]) {
    const isLoggedIn = this.searchCookies(cookies);
    const cookieIsWritten = await this.checkCookieFile();
    if (isLoggedIn && !cookieIsWritten) {
      await this.writeCookies(cookies);
    } else if (!isLoggedIn && cookieIsWritten) {
      await this.useCookies();
    }
  }
}
