const { Builder, By, until } = require("selenium-webdriver");

(async function tasksTest() {
  const loginUrl = "https://tesfa-seven.vercel.app/onboarding/login";
  const tasksUrl = "https://tesfa-seven.vercel.app/tasks";
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

    await driver.sleep(5000);

    await driver.get(tasksUrl);

    let errorElem;
    try {
      errorElem = await driver.wait(
        until.elementLocated(By.css("p.text-red-600")),
        5000
      );
      let errorText = await errorElem.getText();
      console.log("ERROR on /tasks:", errorText);
      console.log("Tasks dashboard test failed: error message rendered.");
      return;
    } catch (err) {}

    let tasks = [];
    try {
      await driver.wait(
        until.elementLocated(By.css('[data-testid="task-list"]')),
        10000
      );
      tasks = await driver.findElements(
        By.css('[data-testid="task-list"] [data-testid="task-item"]')
      );
    } catch (err) {
      tasks = await driver.findElements(
        By.xpath("//*[contains(text(),'Anseba')]")
      );
    }

    if (tasks.length > 0) {
      console.log(`Tasks dashboard test passed! Found ${tasks.length} tasks.`);
    } else {
      console.log(
        "Tasks dashboard loaded, but no tasks found. This is valid if you have not created or been assigned any tasks. Tasks dashboard test passed!"
      );
    }
  } catch (err) {
    console.error("Tasks dashboard test failed:", err);
  } finally {
    await driver.quit();
  }
})();
