const id = (() => {
  return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
})();

const hide_article_containing = (element) => {
  let pivot = element;
  while (pivot) {
    if (pivot.tagName.toLowerCase() === "article") {
      const article = pivot;
      article.style.visibility = "hidden";
      article.style.height = 0;
      article.style.width = 0;
      article.setAttribute(`data-${id}-hidden`, "true");
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

const unsafe = async () => {
  await remove_promotion_tweets();
  await remove_grok_tweets();
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
