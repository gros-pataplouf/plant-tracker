export const debounce = (func, delay = 1000) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func.apply(null, args);
    }, delay);
  };
};

export const resizeTiles = () => {
  for (let slide of document.querySelectorAll(".js__utils__resizeTiles")) {
    const slideHeight = slide.getBoundingClientRect().height;
    const slideMaxHeight = 0.7 * window.innerHeight;
    const diff = slideHeight - slideMaxHeight;
    if (diff > 0) {
      slide.setAttribute("style", `max-height: ${slideMaxHeight}px`);
    }
  }
};
