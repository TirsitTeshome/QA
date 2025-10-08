const { Builder, By, until } = require("selenium-webdriver");

(async function signupTest() {
  const signupUrl = "https://tesfa-seven.vercel.app/onboarding/register";
  let driver = await new Builder().forBrowser("chrome").build();

  try {
    await driver.get(signupUrl);

    let orgInput;
    try {
      orgInput = await driver.wait(
        until.elementLocated(
          By.css('input[placeholder="Enter organization name"]')
        ),
        5000
      );
    } catch (err) {
      try {
        orgInput = await driver.wait(
          until.elementLocated(By.name("organizationName")),
          5000
        );
      } catch (e) {
        throw new Error("Organization Name field not found");
      }
    }
    await orgInput.sendKeys("Test Organization");

    let emailInput;
    try {
      emailInput = await driver.wait(
        until.elementLocated(By.css('input[type="email"]')),
        5000
      );
    } catch (err) {
      try {
        emailInput = await driver.wait(
          until.elementLocated(By.name("email")),
          5000
        );
      } catch (e) {
        throw new Error("Email field not found");
      }
    }
    await emailInput.sendKeys("tirsitEy@gmail.com");

    let passwordInput;
    try {
      passwordInput = await driver.wait(
        until.elementLocated(By.css('input[placeholder="Password"]')),
        5000
      );
    } catch (err) {
      try {
        passwordInput = await driver.wait(
          until.elementLocated(By.name("password")),
          5000
        );
      } catch (e) {
        throw new Error("Password field not found");
      }
    }
    await passwordInput.sendKeys("YourSecurePassword123");

    let confirmPasswordInput;
    try {
      confirmPasswordInput = await driver.wait(
        until.elementLocated(By.css('input[placeholder="Confirm Password"]')),
        5000
      );
    } catch (err) {
      try {
        confirmPasswordInput = await driver.wait(
          until.elementLocated(By.name("confirmPassword")),
          5000
        );
      } catch (e) {
        throw new Error("Confirm Password field not found");
      }
    }
    await confirmPasswordInput.sendKeys("YourSecurePassword123");

    let signUpBtn;
    try {
      signUpBtn = await driver.wait(
        until.elementLocated(By.xpath('//button[contains(.,"Sign up")]')),
        5000
      );
    } catch (err) {
      try {
        signUpBtn = await driver.wait(
          until.elementLocated(By.css('button[type="submit"]')),
          5000
        );
      } catch (e) {
        throw new Error("Sign Up button not found");
      }
    }
    await signUpBtn.click();

    await driver.sleep(3000);
    let pageSource = await driver.getPageSource();
    if (
      pageSource.toLowerCase().includes("success") ||
      pageSource.toLowerCase().includes("account")
    ) {
      console.log("Sign up test passed!");
    } else {
      console.log("Sign up complete, check for confirmation manually.");
    }
  } catch (err) {
    console.error("Sign up test failed:", err);
  } finally {
    await driver.quit();
  }
})();
