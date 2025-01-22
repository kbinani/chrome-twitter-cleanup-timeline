const id = (() => {
  return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
})();

const hide = (element) => {
  // console.log(element);
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

const up = (element, levels) => {
  let p = element;
  for (let i = 0; i < levels && p; i++) {
    p = p.parentElement;
  }
  return p;
}

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
  const spans = document.getElementsByTagName("span");
  for (const span of spans) {
    if (span.innerText === "Grokによる要約") {
      let p = span;
      for (let i = 0; i < 4 && p; i++) {
        p = p.parentElement;
      }
      if (p) {
        hide(p);
      }
      break;
    }
  }
};

const remove_promotions = async () => {
  const business = document.querySelector(`a[href="/i/verified-orgs-signup"][aria-label="ビジネス"]:not([data-${id}-hidden="true"])`);
  if (business) {
    hide(business);
  }
  const renew = document.querySelector(`aside[aria-label="プレミアムサブスクリプションを更新"][role="complementary"]`);
  if (renew) {
    const container = renew.parentElement;
    if (container) {
      hide(container);
    }
  }
  const subscribeLabel = document.querySelector(`aside[aria-label="プレミアムにサブスクライブ"]`);
  if (subscribeLabel) {
    const p2 = up(subscribeLabel, 2);
    if (p2) {
      hide(p2);
    }
  }
  const jobs = document.querySelector(`a[href="/jobs"][role="link"]:not([data-${id}-hidden="true"])`);
  if (jobs) {
    hide(jobs);
  }
};

const unsafe = async () => {
  await remove_promotion_tweets();
  await remove_grok_tweets();
  await remove_grok_menu();
  await remove_promotions();
};

let active = false;

const action = () => {
  if (active) {
    return;
  }
  active = true;
  unsafe().catch(e => console.error(e)).finally(() => {
    active = false;
  });
};

const observer = new MutationObserver(() => {
  action();
});
observer.observe(document.body, { childList: true, subtree: true });
