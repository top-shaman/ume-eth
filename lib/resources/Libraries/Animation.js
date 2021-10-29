"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bgColorChange = bgColorChange;
exports.blur = blur;
exports.blurToFadeIn = blurToFadeIn;
exports.bobble = bobble;
exports.clickBobble = clickBobble;
exports.easeInOut = easeInOut;
exports.expandFadeInBobble = expandFadeInBobble;
exports.expandToFadeOut = expandToFadeOut;
exports.fadeIn = fadeIn;
exports.fadeOut = fadeOut;
exports.filterIn = filterIn;
exports.filterOut = filterOut;
exports.lightBlurToFadeIn = lightBlurToFadeIn;
exports.partialFadeIn = partialFadeIn;
exports.partialFadeOut = partialFadeOut;
exports.unBlur = unBlur;
exports.zipUp = zipUp;

require("core-js/modules/es.parse-int.js");

require("core-js/modules/es.regexp.to-string.js");

function easeInOut(t, b, c) {
  if ((t /= 1 / 2) < 1) return c / 2 * t * t + b;
  return -c / 2 * (--t * (t - 2) - 1) + b;
}

function lightBlurToFadeIn(element, duration) {
  const elements = document.querySelectorAll(element);
  let start = performance.now();
  requestAnimationFrame(function animation(time) {
    let fractionOfTime = (time - start) / duration;
    if (fractionOfTime > 1) fractionOfTime = 1;
    let progress = easeInOut(fractionOfTime, 0, 1);
    elements.forEach(e => {
      e.style.opacity = progress;
      e.style.filter = 'blur(' + (1 / progress - 1) + 'px)';
    });
    if (fractionOfTime < 1) requestAnimationFrame(animation);
  });
}

function blurToFadeIn(element, duration) {
  const elements = document.querySelectorAll(element);
  let start = performance.now();
  requestAnimationFrame(function animation(time) {
    let fractionOfTime = (time - start) / duration;
    if (fractionOfTime > 1) fractionOfTime = 1;
    let progress = easeInOut(fractionOfTime, 0, 1);
    elements.forEach(e => {
      e.style.opacity = progress;
      e.style.filter = 'blur(' + (3 / progress - 3) + 'px)';
    });
    if (fractionOfTime < 1) requestAnimationFrame(animation);
  });
}

function fadeIn(element, duration) {
  const elements = document.querySelectorAll(element);
  let start = performance.now();
  requestAnimationFrame(function animation(time) {
    let fractionOfTime = (time - start) / duration;
    if (fractionOfTime > 1) fractionOfTime = 1;
    let progress = easeInOut(fractionOfTime, 0, 1);
    elements.forEach(e => e.style.opacity = progress);
    if (fractionOfTime < 1) requestAnimationFrame(animation);
  });
}

function fadeOut(element, duration) {
  const elements = document.querySelectorAll(element);
  let start = performance.now();
  requestAnimationFrame(function animation(time) {
    let fractionOfTime = (time - start) / duration;
    if (fractionOfTime > 1) fractionOfTime = 1;
    let progress = easeInOut(fractionOfTime, 1, -1);
    elements.forEach(e => e.style.opacity = progress);
    if (fractionOfTime < 1) requestAnimationFrame(animation);
  });
}

function partialFadeIn(element, duration, value) {
  const elements = document.querySelectorAll(element);
  let start = performance.now();
  requestAnimationFrame(function animation(time) {
    let fractionOfTime = (time - start) / duration;
    if (fractionOfTime > 1) fractionOfTime = 1;
    let progress = easeInOut(fractionOfTime, 0, value);
    elements.forEach(e => e.style.opacity = progress);
    if (fractionOfTime < 1) requestAnimationFrame(animation);
  });
}

function partialFadeOut(element, duration, value) {
  const elements = document.querySelectorAll(element);
  let start = performance.now();
  requestAnimationFrame(function animation(time) {
    let fractionOfTime = (time - start) / duration;
    if (fractionOfTime > 1) fractionOfTime = 1;
    let progress = easeInOut(fractionOfTime, value, -value);
    elements.forEach(e => e.style.opacity = progress);
    if (fractionOfTime < 1) requestAnimationFrame(animation);
  });
}

function blur(element, duration) {
  const elements = document.querySelectorAll(element);
  let start = performance.now();
  requestAnimationFrame(function animation(time) {
    let fractionOfTime = (time - start) / duration;
    if (fractionOfTime > 1) fractionOfTime = 1;
    let progress = easeInOut(fractionOfTime, 0, 1);
    elements.forEach(e => {
      e.style.filter = 'blur(' + 4 * progress + 'px)';
    });
    if (fractionOfTime < 1) requestAnimationFrame(animation);
  });
}

function unBlur(element, duration) {
  const elements = document.querySelectorAll(element);
  let start = performance.now();
  requestAnimationFrame(function animation(time) {
    let fractionOfTime = (time - start) / duration;
    if (fractionOfTime > 1) fractionOfTime = 1;
    let progress = easeInOut(fractionOfTime, 1, -1);
    elements.forEach(e => {
      e.style.filter = 'blur(' + 4 * progress + 'px)';
    });
    if (fractionOfTime < 1) requestAnimationFrame(animation);
  });
}

function bobble(element, duration) {
  duration = duration / 7;
  let start = performance.now();
  const elements = document.querySelectorAll(element);
  let phase = 0;
  let progress;
  requestAnimationFrame(function animate(time) {
    let fractionOfTime = (time - start) / duration;

    if (fractionOfTime > 1 && phase < 6) {
      fractionOfTime = 0;
      start = performance.now();
      phase++;
    } else if (fractionOfTime > 1) fractionOfTime = 1;

    if (phase === 0) progress = easeInOut(fractionOfTime, 1, -0.04);else if (phase === 1) progress = easeInOut(fractionOfTime, 0.96, 0.06);else if (phase === 2) progress = easeInOut(fractionOfTime, 1.02, -0.04);else if (phase === 3) progress = easeInOut(fractionOfTime, 0.98, 0.035);else if (phase === 4) progress = easeInOut(fractionOfTime, 1.015, -0.02);else if (phase === 5) progress = easeInOut(fractionOfTime, 0.995, 0.007);else if (phase === 6) progress = easeInOut(fractionOfTime, 1.002, -0.002);
    elements.forEach(e => e.style.transform = 'scale(' + progress + ')');
    if (fractionOfTime < 1) requestAnimationFrame(animate);else elements.forEach(e => e.style.transform = 'scale(1)');
  });
}

function clickBobble(element, duration) {
  duration = duration / 3;
  let start = performance.now();
  const elements = document.querySelectorAll(element);
  let phase = 0;
  let progress;
  requestAnimationFrame(function animate(time) {
    let fractionOfTime = (time - start) / duration;

    if (fractionOfTime > 1 && phase < 2) {
      fractionOfTime = 0;
      start = performance.now();
      phase++;
    } else if (fractionOfTime > 1) fractionOfTime = 1;

    if (phase === 0) progress = easeInOut(fractionOfTime, 1, -0.02);else if (phase === 1) progress = easeInOut(fractionOfTime, 0.98, 0.05);else if (phase === 2) progress = easeInOut(fractionOfTime, 1.03, -0.03);
    elements.forEach(e => e.style.transform = 'scale(' + progress + ')');
    if (fractionOfTime < 1) requestAnimationFrame(animate);else elements.forEach(e => e.style.transform = 'scale(' + 1 + ')');
  });
}

function expandFadeInBobble(element, duration) {
  duration = duration / 8;
  let start = performance.now();
  const elements = document.querySelectorAll(element);
  let phase = 0;
  let progress1, progress2;
  requestAnimationFrame(function animate(time) {
    let fractionOfTime = (time - start) / duration;

    if (fractionOfTime > 1 && phase < 7) {
      fractionOfTime = 0;
      start = performance.now();
      phase++;
    } else if (fractionOfTime > 1) fractionOfTime = 1;

    if (phase === 0) {
      progress1 = easeInOut(fractionOfTime, 0, 1.04);
      progress2 = easeInOut(fractionOfTime, 0, 1);
    } else if (phase === 1) progress1 = easeInOut(fractionOfTime, 1.04, -0.08);else if (phase === 2) progress1 = easeInOut(fractionOfTime, 0.96, 0.06);else if (phase === 3) progress1 = easeInOut(fractionOfTime, 1.02, -0.04);else if (phase === 4) progress1 = easeInOut(fractionOfTime, 0.98, 0.035);else if (phase === 5) progress1 = easeInOut(fractionOfTime, 1.015, -0.02);else if (phase === 6) progress1 = easeInOut(fractionOfTime, 0.995, 0.007);else if (phase === 7) progress1 = easeInOut(fractionOfTime, 1.002, -0.002);

    elements.forEach(e => e.style.transform = 'scale(' + progress1 + ')');
    elements.forEach(e => e.style.opacity = progress2);
    if (fractionOfTime < 1) requestAnimationFrame(animate);else {
      elements.forEach(e => e.style.transform = 'scale(' + 1 + ')');
    }
  });
}

function expandToFadeOut(element, duration) {
  const elements = document.querySelectorAll(element);
  let start = performance.now();
  requestAnimationFrame(function animation(time) {
    let fractionOfTime = (time - start) / duration;
    if (fractionOfTime > 1) fractionOfTime = 1;
    let progress1 = easeInOut(fractionOfTime, 1, 49),
        progress2 = easeInOut(fractionOfTime, 1, -1);
    elements.forEach(e => {
      e.style.transform = 'scale(' + progress1 + ')';
      e.style.opacity = progress2;
    });
    if (fractionOfTime < 1) requestAnimationFrame(animation);
  });
}

function zipUp(element, duration) {
  const elements = document.querySelectorAll(element);
  let start = performance.now();
  requestAnimationFrame(function animation(time) {
    let fractionOfTime = (time - start) / duration;
    if (fractionOfTime > 1) fractionOfTime = 1;
    let progress = easeInOut(fractionOfTime, 0, 1);
    elements.forEach(e => {
      e.style.transform = 'translate(0px, ' + (10 / progress - 10) + 'px)';
    });
    if (fractionOfTime < 1) requestAnimationFrame(animation);
  });
}

function filterIn(element, brightnessStart, brightnessEnd, hue, duration) {
  const elements = document.querySelectorAll(element);
  let start = performance.now();
  requestAnimationFrame(function animation(time) {
    let fractionOfTime = (time - start) / duration;
    if (fractionOfTime > 1) fractionOfTime = 1;
    let progress1 = easeInOut(fractionOfTime, brightnessStart, brightnessEnd - brightnessStart),
        progress2 = easeInOut(fractionOfTime, 0, 10000);
    elements.forEach(e => {
      e.style.filter = 'invert(0) sepia(1) brightness(' + progress1 + ') saturate(' + progress2 + '%) hue-rotate(' + hue + 'deg)';
    });
    if (fractionOfTime < 1) requestAnimationFrame(animation);
  });
}

function filterOut(element, brightnessStart, brightnessEnd, hue, duration) {
  const elements = document.querySelectorAll(element);
  let start = performance.now();
  requestAnimationFrame(function animation(time) {
    let fractionOfTime = (time - start) / duration;
    if (fractionOfTime > 1) fractionOfTime = 1;
    let progress1 = easeInOut(fractionOfTime, brightnessStart, brightnessEnd - brightnessStart),
        progress2 = easeInOut(fractionOfTime, 10000, -10000);
    elements.forEach(e => {
      e.style.filter = 'invert(0) sepia(1) brightness(' + progress1 + ') saturate(' + progress2 + '%) hue-rotate(' + hue + 'deg)';
    });
    if (fractionOfTime < 1) requestAnimationFrame(animation);
  });
}

function bgColorChange(element, colorStart, colorEnd, duration) {
  const rStart = parseInt(colorStart.slice(0, 2), 16),
        gStart = parseInt(colorStart.slice(2, 4), 16),
        bStart = parseInt(colorStart.slice(4), 16),
        rEnd = parseInt(colorEnd.slice(0, 2), 16),
        gEnd = parseInt(colorEnd.slice(2, 4), 16),
        bEnd = parseInt(colorEnd.slice(4), 16);
  const elements = document.querySelectorAll(element);
  let start = performance.now();
  requestAnimationFrame(function animation(time) {
    let fractionOfTime = (time - start) / duration;
    if (fractionOfTime > 1) fractionOfTime = 1;
    let progressR = Math.floor(easeInOut(fractionOfTime, rStart, rEnd - rStart)),
        progressG = Math.floor(easeInOut(fractionOfTime, gStart, gEnd - gStart)),
        progressB = Math.floor(easeInOut(fractionOfTime, bStart, bEnd - bStart));
    elements.forEach(e => {
      e.style.backgroundColor = '#' + progressR.toString(16).concat(progressG.toString(16), progressB.toString(16));
    });
    if (fractionOfTime < 1) requestAnimationFrame(animation);else elements.forEach(e => {
      e.style.backgroundColor = '#' + colorEnd;
    });
  });
}