const { Builder, By, until } = require("selenium-webdriver");

const expectedTasks = [
  "Address Mental Health and Psychosocial Support Needs in Anseba Region.",
  "Restore and Expand Healthcare Access in Anseba Region.",
  "Provide Nutritional Support and Food Security in Anseba Region.",
  "Enhance Disease Surveillance and Vaccination in Anseba Region.",
  "Improve Water, Sanitation, and Hygiene (WASH) in Anseba Region.",
  "Implement veterinary public health programs in Kassala.",
  "Deliver urgent humanitarian aid in Kassala.",
  "Improve water and sanitation infrastructure in Kassala.",
];

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
      console.log("Tasks dashboard test FAILED: error message rendered.");
      return;
    } catch (err) {}

    let missingTasks = [];
    for (const task of expectedTasks) {
      try {
        await driver.wait(
          until.elementLocated(By.xpath(`//*[contains(text(), "${task}")]`)),
          10000
        );
      } catch (err) {
        missingTasks.push(task);
      }
    }

    if (missingTasks.length === 0) {
      console.log("All expected default tasks are present for new user.");
      console.log("Test PASSED");
    } else {
      console.log("Missing tasks:");
      for (const task of missingTasks) {
        console.log(`- ${task}`);
      }
      console.log("Test FAILED");
    }
  } catch (err) {
    console.error("Tasks dashboard test FAILED:", err);
  } finally {
    await driver.quit();
  }
})();
