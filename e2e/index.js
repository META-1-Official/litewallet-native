const { spawn, execSync } = require('child_process');
const path = require('path');
const webdriverio = require('webdriverio');
const util = require('node:util');
const sleep = util.promisify(setTimeout);
require('dotenv').config({ path: '../.env' })


const pid = spawn('yarn', ['appium'], {
  stdio: 'inherit',
});

console.log('Started pid=', pid.pid);

// Leave the Android platformVersion blank and set deviceName to a random string (Android deviceName is ignored by Appium but is still required)
// If we're using SauceLabs, set the Android deviceName and platformVersion to the latest supported SauceLabs device and version
const DEFAULT_ANDROID_DEVICE_NAME = process.env.SAUCE
  ? 'Android GoogleAPI Emulator'
  : 'My Android Device';
const DEFAULT_ANDROID_PLATFORM_VERSION = process.env.SAUCE ? '7.1' : null;

const androidCaps = {
  platformName: 'Android',
  automationName: 'UiAutomator2',
  deviceName: process.env.ANDROID_DEVICE_NAME || DEFAULT_ANDROID_DEVICE_NAME,
  platformVersion: process.env.ANDROID_PLATFORM_VERSION || DEFAULT_ANDROID_PLATFORM_VERSION,
  app: path.resolve('../android/app/build/outputs/apk/release/app-release.apk'), // Will be added in tests
};

const serverConfig = {
  path: '/wd/hub',
  host: process.env.APPIUM_HOST || 'localhost',
  port: process.env.APPIUM_PORT || 4723,
  logLevel: 'info',
};

const androidOptions = Object.assign(
  {
    capabilities: androidCaps,
  },
  serverConfig,
);

async function run() {
  await sleep(5000);
  const client = await webdriverio.remote(androidOptions);
  await client.status();

  const activity = await client.getCurrentActivity();
  const pkg = await client.getCurrentPackage();
  console.log('===================');
  console.log(activity, pkg);
  console.log('===================');
  await sleep(3000);
  const elem = client.$(
    '/hierarchy/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.ScrollView/android.widget.LinearLayout/android.widget.Button[1]',
  );
  if (elem) {
    elem.click();
  }

  const linkWalletBtn = client.$('~RoundedButton/Link_META_Wallet');
  linkWalletBtn.click();
  const accountNameInput = client.$("~LinkWallet/AccountName");
  accountNameInput.addValue(process.env.DEF_ACC);
  const passwordInput = client.$("~CreateWallet/password");
  passwordInput.addValue(process.env.DEF_PASS);
  const submitBtn = client.$('~RoundedButton/Submit');
  submitBtn.click();
  console.log('===================');
  console.log(elem);
  console.log('===================');
  await sleep(250000);
  //await driver.quit();
}

run().then(() => {
  console.log('all done');
  pid.kill();
});
// setTimeout(() => {
//   console.log('Killing')
//   pid.kill()
// }, 3000);
process.on('SIGINT', function () {
  const _ok = pid.kill();
  execSync("sleep 5");
  process.exit();
});

// what about errors
// try remove/comment this handler, 'exit' event still works
process.on('uncaughtException', (err) => {
  console.log(`Uncaught Exception: ${err.message}`);
  pid.kill();
  process.exit(1);
});
