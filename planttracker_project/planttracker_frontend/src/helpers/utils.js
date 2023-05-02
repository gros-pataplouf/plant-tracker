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
  
export const sliceAfterNearestSpace = (string, index) => {
  for (let i = index; i > 0; i--) {
    if (string[i] === " ") {
      return string.slice(0,i);
    }
    }
  }


