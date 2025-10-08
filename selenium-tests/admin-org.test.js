const { Builder, By, until } = require("selenium-webdriver");

(async function adminOrganizationsTest() {
  const loginUrl = "https://tesfa-seven.vercel.app/onboarding/login";
  const organizationsUrl = "https://tesfa-seven.vercel.app/admin/organizations";
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
    await driver.get(organizationsUrl);

    await driver.wait(
      until.elementLocated(
        By.xpath("//*[contains(text(),'Uganda World Health Organization')]")
      ),
      20000
    );

    let missing = [];

    try {
      await driver.wait(
        until.elementLocated(
          By.xpath(
            "//*[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'page')]"
          )
        ),
        10000
      );
    } catch {
      missing.push("Pagination indicator (Page)");
    }

    const orgsToCheck = [
      "ugandaworldhealth@gmail.com",
      "meronkenya@gmail.com",
      "test@ngo.org",
      "birhanu34@gmail.com",
    ];

    async function textFound(text) {
      const xpath = `//*[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), "${text.toLowerCase()}")]`;
      const elements = await driver.findElements(By.xpath(xpath));
      return elements.length > 0;
    }

    for (const text of orgsToCheck) {
      let found = false;
      let page = 0;
      while (!found && page < 5) {
        if (await textFound(text)) {
          found = true;
          break;
        }
        const nextBtn = await driver.findElements(
          By.xpath(
            "//*[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'next')]"
          )
        );
        if (nextBtn.length > 0) {
          await nextBtn[0].click();
          await driver.sleep(1200);
          page++;
        } else {
          break;
        }
      }
      while (page > 0) {
        const prevBtn = await driver.findElements(
          By.xpath(
            "//*[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'previous')]"
          )
        );
        if (prevBtn.length > 0) {
          await prevBtn[0].click();
          await driver.sleep(600);
        }
        page--;
      }
      if (!found) missing.push(text);
    }

    if (missing.length === 0) {
      console.log(
        "All expected organizations and pagination controls are present."
      );
      console.log("Test PASSED");
    } else {
      console.log("Missing elements:");
      missing.forEach((field) => console.log(`- ${field}`));
      console.log("Test FAILED");
    }
  } catch (err) {
    console.error("Admin organizations page test FAILED:", err);
  } finally {
    await driver.quit();
  }
})();
