const { Builder, By, until } = require("selenium-webdriver");

const trackingColumns = ["Tasks", "Pending", "In progress", "Completed"];

const dropText = "Drop tasks here";

(async function taskTrackingTest() {
  const loginUrl = "https://tesfa-seven.vercel.app/onboarding/login";
  const trackingUrl = "https://tesfa-seven.vercel.app/kanban";
  let driver = await new Builder().forBrowser("chrome").build();

  try {
    await driver.get(loginUrl);

    const emailInput = await driver.wait(
      until.elementLocated(By.css('input[type="email"]')),
      30000
    );
    await emailInput.sendKeys("tirsitEy@gmail.com");

    const passwordInput = await driver.wait(
      until.elementLocated(By.css('input[type="password"]')),
      30000
    );
    await passwordInput.sendKeys("YourSecurePassword123");

    let loginBtn;
    try {
      loginBtn = await driver.wait(
        until.elementLocated(
          By.xpath(
            '//button[contains(translate(., "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"), "sign in")]'
          )
        ),
        30000
      );
    } catch (err) {
      loginBtn = await driver.wait(
        until.elementLocated(By.css('button[type="submit"]')),
        15000
      );
    }
    await loginBtn.click();
    await driver.wait(until.elementLocated(By.css("svg")), 30000);
    await driver.sleep(3000);
    await driver.get(trackingUrl);
    await driver.sleep(2000);
    let missingColumns = [];
    for (const col of trackingColumns) {
      try {
        await driver.wait(
          until.elementLocated(
            By.xpath(
              `//*[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), "${col.toLowerCase()}")]`
            )
          ),
          10000
        );
      } catch (err) {
        missingColumns.push(col);
      }
    }

    let dropTexts = await driver.findElements(
      By.xpath(`//*[contains(text(),"Drop tasks here")]`)
    );

    if (missingColumns.length === 0 && dropTexts.length === 4) {
      console.log("All Task Tracking columns and drop areas are present.");
      console.log("Test PASSED");
    } else {
      if (missingColumns.length > 0) {
        console.log("Missing columns:");
        missingColumns.forEach((col) => console.log(`- ${col}`));
      }
      if (dropTexts.length !== 4) {
        console.log(
          `Expected 4 "Drop tasks here" elements, but found ${dropTexts.length}.`
        );
      }
      console.log("Test FAILED");
    }
  } catch (err) {
    console.error("Task Tracking page test FAILED:", err);
  } finally {
    await driver.quit();
  }
})();
