const id = (() => {
  return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
})();

const hide = (element) => {
  element.style.visibility = "hidden";
  element.style.width = 0;
  element.style.height = 0;
  element.style.padding = 0;
  element.setAttribute(`data-${id}-hidden`, "true");
};

const hide_article_containing = (element) => {
  let pivot = element;
  while (pivot) {
    if (pivot.tagName.toLowerCase() === "article") {
      const article = pivot;
      hide(article);
      return;
    }
    pivot = pivot.parentElement;
  }
};

const remove_promotion_tweets = async () => {
  const spans = document.querySelectorAll(`article:not([data-${id}-hidden="true"]) span`);
  for (const span of spans) {
    if (span.innerText !== "プロモーション" && !span.innerText.endsWith("によるプロモーション")) {
      continue;
    }
    hide_article_containing(span);
  }
};

const remove_grok_tweets = async () => {
  const anchors = document.querySelectorAll(`article:not([data-${id}-hidden="true"]) a`);
  for (const anchor of anchors) {
    const href = anchor.href;
    if (typeof href !== "string") {
      continue;
    }
    if (!href.startsWith("https://x.com/i/grok/")) {
      continue;
    }
    hide_article_containing(anchor);
  }
};

const remove_grok_menu = async () => {
  const anchor = document.querySelector(`a[href="/i/grok"][aria-label="Grok"]:not([data-${id}-hidden="true"])`);
  if (anchor) {
    hide(anchor);
  }
  const grokDrawer = document.querySelector(`div[data-testid="GrokDrawer"]:not([data-${id}-hidden="true"])`);
  if (grokDrawer) {
    hide(grokDrawer);
  }
  const grokImgGen = document.querySelector(`div:not([data-${id}-hidden="true"]) > button[data-testid="grokImgGen"]`);
  if (grokImgGen) {
    hide(grokImgGen.parentElement);
  }
  const grokProfile = document.querySelector(`button:not([data-${id}-hidden="true"])[aria-label="プロフィールの要約"]`);
  if (grokProfile) {
    hide(grokProfile);
  }
};

const unsafe = async () => {
  await remove_promotion_tweets();
  await remove_grok_tweets();
  await remove_grok_menu();
};

let active = false;

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
