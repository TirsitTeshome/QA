const { Builder, By, until } = require("selenium-webdriver");

(async function profileTest() {
  const loginUrl = "https://tesfa-seven.vercel.app/onboarding/login";
  const profileUrl = "https://tesfa-seven.vercel.app/profile";
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
    await driver.get(profileUrl);
    await driver.sleep(1500);

    let missing = [];
    const expectedFields = [
      "Organization name:",
      "Email:",
      "Registration Date:",
      "Tasks Completed:",
      "Task Summary",
      "Recently Completed",
      "No completed tasks yet.",
      "Previous",
      "Next",
    ];
    for (const field of expectedFields) {
      try {
        await driver.wait(
          until.elementLocated(By.xpath(`//*[contains(text(),'${field}')]`)),
          10000
        );
      } catch (err) {
        missing.push(field);
      }
    }

    let zeroTasks = await driver.findElements(
      By.xpath("//*[contains(text(),'Tasks Completed')]")
    );

    let percentNodes = await driver.findElements(
      By.xpath("//*[contains(text(),'0%')] | //*[contains(text(),'0 %')]")
    );
    if (percentNodes.length === 0) {
      let bodyText = await driver.findElement(By.tagName("body")).getText();
      if (bodyText.match(/0\s*%/)) {
        percentNodes = [true];
      }
    }

    if (
      missing.length === 0 &&
      zeroTasks.length > 0 &&
      percentNodes.length > 0
    ) {
      console.log(
        "All expected profile fields and summary elements are present."
      );
      console.log("Test PASSED");
    } else {
      if (missing.length > 0) {
        console.log("Missing elements:");
        missing.forEach((field) => console.log(`- ${field}`));
      }
      if (zeroTasks.length === 0) {
        console.log("- Tasks Completed (partial match failed)");
      }
      if (percentNodes.length === 0) {
        console.log("- 0% (partial match failed)");
        let bodyText = await driver.findElement(By.tagName("body")).getText();
        console.log("BODY TEXT FOR DEBUG:\n" + bodyText);
      }
      console.log("Test FAILED");
    }
  } catch (err) {
    console.error("Profile page test FAILED:", err);
  } finally {
    await driver.quit();
  }
})();
