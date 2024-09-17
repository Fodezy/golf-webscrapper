const { test, expect } = require("@playwright/test");
const fs = require("fs");

// Function to scrape tee times data
async function scrapeTeeTimes(page) {
  await page.waitForSelector(".o-teetime-cardview");

  const teeTimesData = await page.evaluate(() => {
    const results = [];
    document.querySelectorAll(".o-teetime-cardview .row").forEach((row) => {
      row.querySelectorAll(".col-6").forEach((item) => {
        const time =
          item.querySelector(".a-teetime-time span")?.innerText || "N/A";
        const course =
          item.querySelector(".a-timetime-course span")?.innerText || "N/A";
        const price =
          item.querySelector(".a-teetime-price")?.innerText || "N/A";
        const players =
          item.querySelector('[aria-label="Players"] .a-text')?.innerText ||
          "N/A";
        const holes =
          item.querySelector('[aria-label="Holes"] .a-text')?.innerText ||
          "N/A";

        results.push({ time, course, price, players, holes });
      });
    });
    return results;
  });

  return teeTimesData;
}

/*

test("Scrape tee times", async ({ page }) => {
  await page.goto("https://app.golfthe6ix.com/web/tee-times");
});

test("Search Button", async ({ page }) => {
  await page.goto("https://app.golfthe6ix.com/web/tee-times");

  // Click the search button
  await page.click(".o-teetime-filter-button");

  const teeTimesData = await scrapeTeeTimes(page);

  // if either day is over or all tee times are booked for the day
  if (teeTimesData.length === 0) {
    console.log("Empty string");

    await page.click('input[placeholder="Choose date"]');

    await page.waitForSelector(".mat-calander");

    const currentDay = await page.evaluate(
      ".mat-calendar-body-selected .mat-calendar-body-cell-content",
      (el) => el.textContent.trim()
    );
    const nextDay = parseInt(currentDay) + 1;

    await page.click('.mat-calendar-body-cell-content:text("${nextDay}")');
  } else {
    console.log("Not empty string");
  }

  const report = teeTimesData
    .map(
      (entry) =>
        `Time: ${entry.time}, Course: ${entry.course}, Price: ${entry.price}, Players: ${entry.players}, Holes: ${entry.holes}`
    )
    .join("\n");

  // Write the data to golfthe6-report.txt
  fs.writeFileSync("golfthe6-report.txt", report);

  console.log("Report saved to golfthe6-report.txt");
});
*/

test("Select Player number", async ({ page }) => {
  await page.goto("https://app.golfthe6ix.com/web/tee-times");

  // Click the dropdown to expand player options
  await page.click('mat-select[formcontrolname="Players"]');

  // Wait for the dropdown options to appear
  await page.waitForSelector(".mat-option-text");

  // Select the desired number of players (e.g., 2 Players)
  await page.click('.mat-option-text:text("Any")');
});

test("Select Date", async ({ page }) => {
  await page.goto("https://app.golfthe6ix.com/web/tee-times");

  await page.click('input[placeholder="Choose date"]');

  await page.waitForSelector(".mat-calander");
  const currentDay = new Date().toDateString();


  /*
  const currentDay = await page.evaluate(
    ".mat-calendar-body-selected .mat-calendar-body-cell-content",
    (el) => el.textContent.trim()
  );
  const nextDay = parseInt(currentDay) + 1;

  await page.click(`.mat-calendar-body-cell-content:text("${nextDay}")`);
*/
});
