const debounce = (cb, delay) => {
  let lastTimeout = null;

  return (...args) => {
    if (lastTimeout) {
      clearTimeout(lastTimeout);
    }
    lastTimeout = setTimeout(() => {
      cb(...args);
    }, delay);
  };
};

export {debounce};
