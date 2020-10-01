const puppeteer = require("puppeteer");
import { writeFile } from "fs";
import { resolve } from "path";
import Hero from "../../models/hero";
import { url } from "inspector";

async function getHeroes() {
  const START_URL = "https://www.marvel.com/characters";
  const heroes: Hero[] = [];

  const browser = await puppeteer.launch({
    headless: true,
  });
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);
  await page.setUserAgent(
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36"
  );

  console.log("Getting heroes from website", START_URL);
  await page.goto(START_URL);

  await page.waitForSelector("body");

  // getting the name and photo for each hero
  let urls = await page.evaluate(() => {
    let heroId = 0;
    let results = [];

    let items = document.querySelectorAll(
      "body section:nth-child(3) > div > div:nth-child(2) > div"
    );
    items.forEach((item) => {
      let heroName = item.querySelector("a > div:nth-child(2) > p").innerHTML;
      let heroPhoto = item.querySelector(
        "a > div:nth-child(1) > figure > img"
      ) as HTMLImageElement;

      let heroBioLink = item.querySelector("a") as HTMLAnchorElement;
      heroId++;
      results.push({
        id: heroId.toString(),
        name: heroName,
        photo: heroPhoto.src,
        bio: heroBioLink.href,
      });
    });
    return results;
  });

  urls.forEach((item) => {
    heroes.push(new Hero(item.id, item.name, item.photo, item.bio));
  });

  await browser.close();

  writeFile(
    resolve(__dirname, "../heroes.json"),
    JSON.stringify(heroes, null, 2),
    (err) => {
      if (err) {
        throw err;
      }
      console.log("Finished writing file");
    }
  );
}

getHeroes();

// async function getHeroDetails(heroBioLink: String, id: any) {
//   const START_URL = heroBioLink;

//   const browser = await puppeteer.launch({
//     headless: true,
//   });
//   const page = await browser.newPage();

//   await page.setDefaultNavigationTimeout(0);
//   await page.setUserAgent(
//     "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36"
//   );

//   console.log("Getting hero Details from website", START_URL);
//   await page.goto(START_URL);

//   await page.waitForSelector("body");

//   let urls = await page.evaluate(() => {
//     let results = [];

//     let items = document.querySelectorAll(
//       "body > div > div > div > div > section > div > div > div:nth-child(2) > div > div"
//     );
//     items.forEach((item) => {
//       let heroBio = item.querySelector("div").innerHTML;
//       results.push({
//         bio: heroBio,
//       });
//     });
//     return results;
//   });

//   console.log(urls[0].bio);
// }
