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
  
// export const sliceAfterNearestSpace = (string, index) => {
//   for (let i = index; i > 0; i--) {
//     if (string[i] === " ") {
//       return string.slice(0,i);
//     }
//   }
//   }

export const resizeTiles = () => {
  console.log("resizing")
  console.log(document.querySelectorAll('.emblaSlide'))
  for (let slide of document.querySelectorAll('.emblaSlide')) {
    const slideHeight = slide.getBoundingClientRect().height;
    const titleHeight = document.querySelector('#title').getBoundingClientRect().height;
    const slideMaxHeight = 0.76*window.innerHeight - titleHeight;
    const diff = slideHeight - slideMaxHeight;
    if (diff > 0) {
      slide.setAttribute("style", `max-height: ${slideMaxHeight}px`);
  
    }
  }

  }
  


