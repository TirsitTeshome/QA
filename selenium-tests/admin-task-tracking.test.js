const { Builder, By, until } = require("selenium-webdriver");

(async function adminTaskTrackingTest() {
  const loginUrl = "https://tesfa-seven.vercel.app/onboarding/login";
  const taskTrackingUrl = "https://tesfa-seven.vercel.app/admin/task-tracking";
  let driver = await new Builder().forBrowser("chrome").build();

  try {
    await driver.get(loginUrl);

    const emailInput = await driver.wait(
      until.elementLocated(By.css('input[type="email"]')),
      30000
    );
    await emailInput.sendKeys("tesfaagent@gmail.com");

    const passwordInput = await driver.wait(
      until.elementLocated(By.css('input[type="password"]')),
      30000
    );
    await passwordInput.sendKeys("tesfa123456");

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

    await driver.sleep(3000);
    await driver.get(taskTrackingUrl);

    try {
      await driver.wait(async function () {
        const elems = await driver.findElements(
          By.xpath("//*[contains(text(),'Loading dashboard data...')]")
        );
        return elems.length === 0;
      }, 30000);
    } catch (err) {
      console.log("Dashboard data did not finish loading in 30 seconds.");
      throw err;
    }

    await driver.sleep(1000);

    let missing = [];

    try {
      await driver.wait(
        until.elementLocated(
          By.xpath(`//*[contains(text(),'Predicted Cases')]`)
        ),
        10000
      );
    } catch {
      missing.push("Predicted Cases");
    }

    let predictedCasesFound = false;
    try {
      let casesLabels = await driver.findElements(
        By.xpath(
          "//*[contains(text(),'Predicted Cases')]/preceding-sibling::*[1]"
        )
      );
      if (casesLabels.length === 0) {
        casesLabels = await driver.findElements(
          By.xpath(
            "//*[contains(text(),'Predicted Cases')]/ancestor::*[1]//*[text()[normalize-space() and string-length() <= 3 and string-length() > 0 and number(.) = number(.)]]"
          )
        );
      }
      for (const el of casesLabels) {
        const txt = await el.getText();
        if (txt.match(/^\d+$/)) {
          predictedCasesFound = true;
          break;
        }
      }
    } catch {}
    if (!predictedCasesFound) missing.push("Predicted Cases Number");

    let pageTextFound = false;
    try {
      const pageElems = await driver.findElements(
        By.xpath("//*[contains(text(),'Page')]")
      );
      if (pageElems.length > 0) pageTextFound = true;
    } catch {}
    if (!pageTextFound) missing.push("Page (pagination)");

    let nextFound = false,
      prevFound = false;
    try {
      if (
        (await driver.findElements(By.xpath("//*[contains(text(),'Next')]")))
          .length > 0
      )
        nextFound = true;
      if (
        (
          await driver.findElements(
            By.xpath("//*[contains(text(),'Previous')]")
          )
        ).length > 0
      )
        prevFound = true;
    } catch {}
    if (!nextFound) missing.push("Next");
    if (!prevFound) missing.push("Previous");

    if (missing.length === 0) {
      console.log(
        "All major elements present on the admin task tracking page."
      );
      console.log("Test PASSED");
    } else {
      console.log("Missing elements:");
      missing.forEach((field) => console.log(`- ${field}`));
      console.log("Test FAILED");
    }
  } catch (err) {
    console.error("Admin task tracking page test FAILED:", err);
  } finally {
    await driver.quit();
  }
})();
