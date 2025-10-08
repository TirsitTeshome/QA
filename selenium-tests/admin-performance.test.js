const { Builder, By, until } = require("selenium-webdriver");

(async function adminPerformanceTest() {
  const loginUrl = "https://tesfa-seven.vercel.app/onboarding/login";
  const performanceUrl = "https://tesfa-seven.vercel.app/admin/performance";
  let driver = await new Builder().forBrowser("chrome").build();

  try {
    await driver.get(loginUrl);

    await driver
      .wait(until.elementLocated(By.css('input[type="email"]')), 30000)
      .sendKeys("tesfaagent@gmail.com");
    await driver
      .wait(until.elementLocated(By.css('input[type="password"]')), 30000)
      .sendKeys("tesfa123456");

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
    } catch {
      loginBtn = await driver.wait(
        until.elementLocated(By.css('button[type="submit"]')),
        15000
      );
    }
    await loginBtn.click();

    await driver.sleep(3000);
    await driver.get(performanceUrl);

    await driver.wait(
      until.elementLocated(By.xpath("//*[contains(text(),'Tesfa Agent')]")),
      20000
    );

    let missing = [];

    const stats = ["Accuracy", "Efficiency", "70%", "60%"];
    for (const stat of stats) {
      try {
        await driver.wait(
          until.elementLocated(By.xpath(`//*[contains(text(),'${stat}')]`)),
          10000
        );
      } catch {
        missing.push(stat);
      }
    }

    try {
      await driver.wait(
        until.elementLocated(
          By.xpath("//*[contains(text(),'Number of Queries')]")
        ),
        10000
      );
    } catch {
      missing.push("Number of Queries chart");
    }
    try {
      await driver.wait(
        until.elementLocated(By.xpath("//*[contains(text(),'Monthly View')]")),
        10000
      );
    } catch {
      missing.push("Monthly View button");
    }

    try {
      await driver.wait(
        until.elementLocated(
          By.xpath("//*[contains(text(),'API Usage Overview')]")
        ),
        10000
      );
    } catch {
      missing.push("API Usage Overview");
    }
    try {
      await driver.wait(
        until.elementLocated(
          By.xpath("//*[contains(text(),'Monthly API Calls by Endpoint')]")
        ),
        10000
      );
    } catch {
      missing.push("Monthly API Calls by Endpoint");
    }

    try {
      await driver.wait(until.elementLocated(By.css("select")), 10000);
    } catch {
      missing.push("Month dropdown");
    }

    const sidebar = [
      "Dashboard",
      "Tasks",
      "Organizations",
      "Performance",
      "Logout",
      "Tesfa admin",
    ];
    for (const item of sidebar) {
      try {
        await driver.wait(
          until.elementLocated(By.xpath(`//*[contains(text(),'${item}')]`)),
          10000
        );
      } catch {
        missing.push(item);
      }
    }

    if (missing.length === 0) {
      console.log("All expected performance dashboard elements are present.");
      console.log("Test PASSED");
    } else {
      console.log("Missing elements:");
      missing.forEach((field) => console.log(`- ${field}`));
      console.log("Test FAILED");
    }
  } catch (err) {
    console.error("Admin performance page test FAILED:", err);
  } finally {
    await driver.quit();
  }
})();
