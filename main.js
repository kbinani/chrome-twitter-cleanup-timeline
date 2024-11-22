const id = (() => {
  return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
})();

const unsafe = async () => {
  const spans = document.querySelectorAll(`article:not([data-${id}-hidden="true"]) span`);
  for (const span of spans) {
    if (span.innerText !== "プロモーション" && !span.innerText.endsWith("によるプロモーション")) {
      continue;
    }
    let pivot = span;
    while (pivot) {
      if (pivot.tagName.toLowerCase() === "article") {
        const article = pivot;
        article.style.visibility = "hidden";
        article.style.height = 0;
        article.style.width = 0;
        article.setAttribute(`data-${id}-hidden`, "true");
        break;
      }
      pivot = pivot.parentElement;
    }
  }
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
