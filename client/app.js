const puppeteer = require('puppeteer');
const http = require('http');

const params = {
  port: 5555,
  host: 'server',
  method: 'GET',
  path: 'http://server:5555/task',
};

function getData(params) {
  httpRequest(params)
    .then(result => {
      newString = result.match("'(.+?)'}");
      return 'https://www.' + newString[1];
    })
    .then(url => goToTheWeb(url));
}

getData(params);

function httpRequest(params) {
  return new Promise(function(resolve, reject) {
    let req = http.request(params, function(res) {
      if (res.statusCode < 200 || res.statusCode >= 300) {
        return reject(new Error('statusCode=' + res.statusCode));
      }
      let body = [];
      res.on('data', function(chunk) {
        body.push(chunk);
      });
      res.on('end', function() {
        try {
          body = Buffer.concat(body).toString();
        } catch (e) {
          reject(e);
        }
        resolve(body);
      });
    });
    req.on('error', function(err) {
      reject(err);
    });
    req.end();
  });
}

async function goToTheWeb(url) {
  try {
    const browser = await puppeteer.launch({
      //   Параметры для запуска графической оболочки
      // headless: false,
      // slowMo: 50,
    });

    console.log('\nDOMAIN is ', url, '\n');

    const page = await browser.newPage();
    await page.goto(url);

    Promise.all([
      await page.type('input', 'Привет, как дела?'),
      await page.keyboard.press('Enter'),
      await page.waitForNavigation(),
    ])
      .then((resolve, reject) => {
        console.log(url);

        if (url === 'https://www.google.com') {
          const elementsArray = page.$$eval('div.rc > div.r > a', elements =>
            elements.map(el => el.getAttribute('href'))
          );
          return elementsArray;
        }
        if (url == 'https://www.yandex.ru') {
          const elementsArray = page.$$eval('li.serp-item > div > h2 > a', elements =>
            elements.map(el => el.getAttribute('href'))
          );
          return elementsArray;
        }
      })
      .then(elementArray => {
        console.log('Going to the following page....', elementArray[4]);
        return Promise.all([page.goto(elementArray[4]), page.waitForNavigation()]);
      })
      .then(() => {
        browser.close();
        //Вызываем фунцию циклично
        getData(params);
        //
      })
      .catch(e => {
        throw new Error(e);
      });
  } catch (e) {
    throw new Error(e);
  }
}
