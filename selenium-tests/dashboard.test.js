const { Builder, By, until } = require("selenium-webdriver");

(async function adminDashboardTest() {
  const loginUrl = "https://tesfa-seven.vercel.app/onboarding/login";
  const dashboardUrl = "https://tesfa-seven.vercel.app/admin/dashboard";
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

    await driver.wait(until.urlContains("/admin/dashboard"), 30000);
    await driver.get(dashboardUrl);
    await driver.sleep(2000);

    const expectedDashboardFields = [
      "High Risk Areas",
      "Total Organizations",
      "Active Organizations",
      "Total Queries",
      "Active Organizations",
      "AI Functionality",
      "Number of High-Risk Countries",
      "High-Risk Countries",
      "Kenya",
      "Djibouti",
      "Eritrea",
      "Uganda",
      "Ethiopia",
      "Sudan",
      "Dashboard",
      "Tasks",
      "Organizations",
      "Performance",
      "Logout",
      "Tesfa admin",
    ];
    let missing = [];
    for (const field of expectedDashboardFields) {
      try {
        await driver.wait(
          until.elementLocated(By.xpath(`//*[contains(text(),'${field}')]`)),
          10000
        );
      } catch (err) {
        missing.push(field);
      }
    }

    if (missing.length === 0) {
      console.log(
        "All expected admin dashboard widgets and sidebar menu items are present."
      );
      console.log("Test PASSED");
    } else {
      console.log("Missing elements:");
      missing.forEach((field) => console.log(`- ${field}`));
      console.log("Test FAILED");
    }
  } catch (err) {
    console.error("Admin dashboard page test FAILED:", err);
  } finally {
    await driver.quit();
  }
})();
