let active = false;

const wait = async (ms = 100) => {
  return new Promise((res, rej) => {
    setTimeout(res, ms);
  });
};

const clickLaterButton = async () => {
  const laterButtonLabels = document.querySelectorAll('button[role="button"] span');
  let laterButtonLabel;
  for (const b of laterButtonLabels) {
    if (b.innerText === "後で試す") {
      laterButtonLabel = b;
      break;
    }
  }
  if (!laterButtonLabel) {
    return;
  }
  pivot = laterButtonLabel;
  let laterButton;
  while (pivot) {
    if (pivot.tagName.toLowerCase() === "button") {
      laterButton = pivot;
      break;
    }
    pivot = pivot.parentElement;
  }
  if (!laterButton) {
    return;
  }
  laterButton.click();
};

const unsafe = async () => {
  const spans = document.querySelectorAll('article span');
  let target;
  for (const span of spans) {
    if (span.innerText === "プロモーション" || span.innerText.endsWith("によるプロモーション")) {
      target = span;
      break;
    }
  }
  if (!target) {
    return;
  }
  let pivot = target;
  let article;
  while (pivot) {
    if (pivot.tagName.toLowerCase() === "article") {
      article = pivot;
      break;
    }
    pivot = pivot.parentElement;
  }
  if (!article) {
    return;
  }
  const button = article.querySelectorAll('button[aria-label="もっと見る"][aria-expanded="false"]')[0];
  const nameSpans = article.querySelectorAll('a[role="link"] > div > span');
  let name;
  for (const s of nameSpans) {
    if (s.innerText.startsWith("@")) {
      name = s.innerText.substr(1);
      break;
    }
  }
  if (!name) {
    return;
  }
  if (!button) {
    return;
  }
  button.click();
  await wait();
  const muteButtonLabels = document.querySelectorAll('div[role="menuitem"] span');
  let muteButtonLabel;
  for (const b of muteButtonLabels) {
    if (b.innerText === `@${name}さんをミュート`) {
      muteButtonLabel = b;
      break;
    }
  }
  if (!muteButtonLabel) {
    return;
  }
  let muteButton;
  pivot = muteButtonLabel;
  while (pivot) {
    if (pivot.tagName.toLowerCase() === 'div' && pivot.getAttribute("role") === "menuitem") {
      muteButton = pivot;
      break;
    }
    pivot = pivot.parentElement;
  }
  if (!muteButton) {
    return;
  }
  muteButton.click();
  console.log(`muted @${name}`);
};

const tick = () => {
  if (active) {
    return;
  }
  active = true;
  unsafe().catch(e => console.error(e)).finally(() => {
    active = false;
  });
};

setInterval(tick, 100);

let working = false;
const r = () => {
  if (working) {
    return;
  }
  working = true;
  clickLaterButton().finally(() => {
    working = false;
  });
};
setInterval(r, 1);