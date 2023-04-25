const store = new Map();
const INTERVAL = 20000;
MGX_TAG = "holypics0013781w2t72tyyt";
BLUR_RADIS = 100;
const QUEUED_ATTR = MGX_TAG + "status";
const LIMIT_LIST = 100;

function uuid() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function getSrc(img) {
  if (img.hasAttribute("src")) return img.getAttribute("src");
  if (img.hasAttribute("srcset")) return img.getAttribute("srcset");
  if (img.hasAttribute("data-src")) return img.getAttribute("data-src");
}

function setSrc(img, value) {
  if (img.hasAttribute("src")) return img.setAttribute("src", value);
  if (img.hasAttribute("srcset")) return img.setAttribute("srcset", value);
  if (img.hasAttribute("data-src")) return img.setAttribute("data-src", value);
}

function getDataUrl(img) {
  // Create canvas
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  // Set width and height
  canvas.width = img.width;
  canvas.height = img.height;
  // Draw the image
  ctx.drawImage(img, 0, 0, img.width, img.height);
  return canvas.toDataURL("image/jpeg");
}

function writeOnImage(img, text) {
  // Create canvas
  const canvas = document.createElement("canvas");

  // if(text == "" || text == undefined) return canvas.toDataURL('image/jpeg');

  const ctx = canvas.getContext("2d");
  // Set width and height
  canvas.width = img.width;
  canvas.height = img.height;
  // Draw the image
  ctx.drawImage(img, 0, 0, img.width, img.height);

  ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = "20px serif";
  ctx.fillStyle = "#fff";

  const x = 30;
  const y = 30;
  const lineheight = 20;
  const lines = text.split("\n");
  for (let i = 0; i < lines.length; i++)
    ctx.fillText(lines[i], x, y + i * lineheight);

  // ctx.fillText(text, 10, 100, img.width);

  return canvas.toDataURL("image/jpeg");
}

function blurImage(img) {
  img.style.filter = `blur(${BLUR_RADIS}px)`;
}

function cutArray(myArray, startPoint, endPoint) {
  const newArray = [];
  const limit = endPoint == -1 ? myArray.length - 1 : endPoint;
  for (let i = startPoint; i < limit; i++) {
    newArray.push(myArray[i]);
  }
  return newArray;
}

function analyseImage(img) {
  return new Promise((resolve, reject) => {
    let dataUrl;
    const apiUrl = "https://api-holipics.karamokoisrael.tech/predictFromUrl";
    try {
      dataUrl = getDataUrl(img);
      const options = {
        method: "POST",
        // agent: proxyAgent,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        mode: "cors",
        body: JSON.stringify({ url: dataUrl }),
      };
      blurImage(img, {});
      resolve(true);
      // return;
      // fetch(apiUrl, options).then((response) => {
      //   response
      //     .json()
      //     .then((json) => {
      //       // console.log(json)
      //       if (json.error == undefined) return;
      //       console.log(json.predictions);
      //       console.log(json.to_print.includes("normal"));
      //       if (json.to_print == undefined || json.to_print.includes("normal"))
      //         return;
      //       console.log("writing on image");

      //       blurImage(img, json);
      //     })
      //     .catch((error) => {
      //       console.log(error);
      //     });
      // });
    } catch (error) {
      reject(error);
    }
  });
}

function populateQueue() {
  const imgs = document.querySelectorAll(`img:not([${QUEUED_ATTR}="true"]`);
  // `img:not([${QUEUED_ATTR}="true"]`

  if (imgs.length == 0) return;
  if (LIMIT_LIST != -1) {
    const items = cutArray(imgs, 0, LIMIT_LIST);
    items.forEach((img) => {
      if (!img) return;
      img.setAttribute(QUEUED_ATTR, true);
      store.set(uuid(), img);
    });
    console.log(`adding ${items.length} items`);
  }
}

function initialize() {
  const css = "h1 { background: red; }",
    head = document.head || document.getElementsByTagName("head")[0],
    style = document.createElement("style");

  head.appendChild(style);
  console.log("ready");
  console.log("initializing");
  populateQueue();
  window.onscroll = async (e) => {
    populateQueue();
  };

  setInterval(() => {
    console.log(`processing queue: ${store.length} items `);

    store.forEach(async (value, key) => {
      try {
        await analyseImage(value);
        console.log(key);
        store.delete(key);
      } catch (error) {
        console.log(error);
      } finally {
        await sleep(1000);
      }
    });
  }, INTERVAL);
}

if (window.location.href.includes("civitai.com")) {
  setTimeout(() => {
    initialize();
  }, 3000);
}
