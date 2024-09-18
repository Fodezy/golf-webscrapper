const { test, expect } = require("@playwright/test");
const fs = require("fs");
const path = 'golfthe6-report.txt';

async function loadPage(page) {
  await page.goto("https://app.golfthe6ix.com/web/tee-times");
}

async function selectNextDay(page) {
  await page.click('input[placeholder="Choose date"]');
  await page.waitForSelector('[data-mat-calendar="mat-datepicker-0"]');
  
  const nextDay = new Date().getDate() + 1;
  await page.click(`.mat-calendar-body-cell-content:text("${nextDay}")`);
}

async function selectCourse(page, courseName) {
  // Click the course dropdown (the input field)
  await page.click('#mat-input-1');
  
  // Wait for the course options to appear (adjust this selector if necessary)
  await page.waitForSelector('.a-text-h3');  // this line isn not working 
  
  // Check if courseName is provided, if not, select "All Courses"
  if (!courseName) {
    // Select "All Courses"
    await page.click('.mat-checkbox-label:has-text("All Courses")');
  } else {
    // Select the course based on the provided courseName
    await page.click('.mat-checkbox-label:has-text("All Courses")'); // deselect all courses
    await page.click(`.mat-checkbox-label:has-text("${courseName}")`);
    await page.click(`.mat-button-wrapper:has-text("Done")`);
  }
}

async function selectPlayerAmount(page, amount) {
  
  await page.click('mat-select[formcontrolname="Players"]');

  // Wait for the dropdown options to appears
  await page.waitForSelector(".mat-option-text");

  // Select the desired number of players (e.g., 2 Players)
  if(!amount || amount === "Any")
  {
    await page.click('.mat-option-text:text("Any")');
  } else if(amount >=1 || amount <= 4) {
    await page.click(`.mat-option-text:has-text("${amount} Players")`);
  }
}

async function selectTime(page, time) {
  //await page.waitForTimeout(2000);

  await page.click('input[formcontrolname="time"]');

  await page.waitForSelector('input[formcontrolname="time"]', { visible: true });  

  // Type the time (for example "09:30AM" or "3:00PM")
  await page.fill('input[formcontrolname="time"]', time);

  await page.mouse.click(300,0);
  await page.waitForTimeout(4000); // Wait for 4 seconds before checking visibility

}



// Function to scrape tee times data
async function scrapeTeeTimesInfo(page) {

  await page.click(".o-teetime-filter-button");

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

async function writeToFile(teeTimesData) {
  const report = teeTimesData
    .map(
      (entry) =>
        `Time: ${entry.time}, Course: ${entry.course}, Price: ${entry.price}, Players: ${entry.players}, Holes: ${entry.holes}`
    )
    .join("\n");

  // Check if the file exists

  // If the file exists, append to it
  fs.appendFileSync(path, "\n" + report);
  console.log("Report appended to golfthe6-report.txt");
 
}

/*
test("Scrape tee times", async ({ page }) => {
  await page.goto("https://app.golfthe6ix.com/web/tee-times");
});
  
  test("Search Button", async ({ page }) => {
    await page.goto("https://app.golfthe6ix.com/web/tee-times");
    
    // Click the search button
    await page.click(".o-teetime-filter-button");
    
    const teeTimesData = await scrapeTeeTimesInfo(page);
    
    // if either day is over or all tee times are booked for the day          
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

  await page.waitForSelector('[data-mat-calendar="mat-datepicker-0"]');
  const nextDay = new Date().getDate() + 1;
  await page.click(`.mat-calendar-body-cell-content:text("${nextDay}")`);

  await page.click(".o-teetime-filter-button");

  const teeTimesData = await scrapeTeeTimesInfo(page);

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

test("Select a golf course", async ({ page }) => {
  // Navigate to the page
  await page.goto("https://app.golfthe6ix.com/web/tee-times");

  // Select a specific course by name
  await selectCourse(page, "Dentonia Park"); // Replace "Course Name" with the actual course name

  // Add more steps as needed, like selecting players or scraping data
});

*/

/*
test("Select time", async ({ page }) => {
  await loadPage(page);

  await selectNextDay(page);

  await page.click(".o-teetime-filter-button");
  await page.waitForSelector('.o-teetime-cardview', { visible: true, timeout: 60000 });

  //await page.waitForTimeout(2000);

  await selectTime(page, "12:00PM");

  await page.waitForTimeout(3000); // Wait for 3 seconds before checking visibility
  await page.click(".o-teetime-filter-button");
  await page.waitForSelector('.o-teetime-cardview', { visible: true, timeout: 60000 });
})


test("Find next day info for all Dentonia Park time slots", async ({ page }) => {
  await loadPage(page);
  await selectNextDay(page);
  await selectCourse(page, "Dentonia Park")
  await selectPlayerAmount(page, "Any");

  let teeTimesData = await scrapeTeeTimesInfo(page); 

  const lastTeeTime = teeTimesData[teeTimesData.length - 1]
  const lasteeTime_Time = lastTeeTime.time;
  writeToFile(teeTimesData); 

  teeTimesData = []
  let timeString = lasteeTime_Time.replace(" ", "");

  console.log(timeString);

  await selectTime(page, timeString);
  teeTimesData = await scrapeTeeTimesInfo(page); 
  writeToFile(teeTimesData);  // adds first tee time to file again, need to change later 

});

*/

let responseHandled = false;  // Flag to ensure only one response is handled

test('Capture and save TeeTimeData from XHR response to a file', async ({ page }) => {
  fs.writeFileSync('TeeTimeData.txt', "");
  fs.writeFileSync(path, "");
  // Register the 'response' event listener before triggering the request
  page.on('response', async (response) => {
    // Check if the request URL matches the XHR request you're looking for
    if (response.url().includes('/Booking/Teetimes')) {
      try {
        // Parse the JSON response
        const jsonResponse = await response.json();

        /* 
        dont need for now, access a diffrent field of data
        if(jsonResponse.Filters && jsonResponse.Filters.SelectedHole !== undefined && !responseHandled) { //
        responseHandled = true;  
        
        const selectedHole  = jsonResponse.Filters.SelectedHole;
        
        const holeReport = `Holes: ${selectedHole}`; 
        
        fs.appendFileSync('TeeTimeData.txt', holeReport);
        
        console.log("Hole data saved to TeeTimeData.txt");
      }
      */

        // Check if the response contains TeeTimeData and it's not empty
        if (jsonResponse.TeeTimeData && jsonResponse.TeeTimeData.length > 0) {

          const teeTimeData = jsonResponse.TeeTimeData;

          // Convert the TeeTimeData into a formatted string
          const report = teeTimeData.map(entry => 
            `\nTime: ${entry.Title}, Course: ${entry.SubTitle}, Cost: ${entry.PerPlayerCost}, Holes: ${entry.Holes}, Avaliable Slots: ${entry.AvailableSlot}`
          ).join();

          // Write the data to a file (overwrite each time)
          fs.appendFileSync('TeeTimeData.txt', report);

          console.log("TeeTimeData saved to TeeTimeData.txt");
        } else {
          console.log("Empty or no TeeTimeData in response, skipping...");
        }
      } catch (error) {
        console.error("Failed to parse JSON response:", error);
      }
    }
  });

  // Trigger the actions that cause the XHR request
  await loadPage(page);            // Navigate to the page
  await selectNextDay(page);       // Perform actions to select the next day
  await selectCourse(page, "Dentonia Park")
  await selectPlayerAmount(page, "Any");
  let teeTimesData = await scrapeTeeTimesInfo(page); 

  const lastTeeTime = teeTimesData[teeTimesData.length - 1]
  const lasteeTime_Time = lastTeeTime.time;
  writeToFile(teeTimesData); 

  teeTimesData = []
  let timeString = lasteeTime_Time.replace(" ", "");
  const newTime = await clockMath(timeString);



  await selectTime(page, newTime);
  teeTimesData = await scrapeTeeTimesInfo(page); 
  writeToFile(teeTimesData); 

  // Ensure there's enough time for the network requests to be made and captured
  await page.waitForTimeout(5000);  // Adjust this as necessary
});

async function clockMath(time)
{
  // 12:40PM
  console.log(time);

  // Extract AM/PM and save it
  let period = time.slice(-2); // Get last two characters, AM or PM

  // Remove AM/PM from time
  let notTimePeriod = time.slice(0, -2);

  let [hours, minutes] = notTimePeriod.split(":");

  

  let intHours = parseInt(hours);
  let intMinutes = parseInt(minutes);

  if (intMinutes >= 50) {
    intHours = intHours + 1; // Increment the hour
    intMinutes = 0;          // Reset minutes to 00
  } else {
    intMinutes = intMinutes + 10; // Add 10 to the current minutes
  }

  // Ensure hours and minutes are formatted correctly (two digits)
  let formattedHours = intHours.toString().padStart(2, '0');
  let formattedMinutes = intMinutes.toString().padStart(2, '0');

  let updatedTime = `${formattedHours}:${formattedMinutes}${period}`;
  console.log(`Updated Time: ${updatedTime}`);

  return updatedTime;

}



