export function easeInOut (t, b, c) {
  if ((t /= 1 / 2) < 1) return c / 2 * t * t + b;
  return -c / 2 * ((--t) * (t - 2) - 1) + b;
}
export function lightBlurToFadeIn(element, duration) {
  const elements = document.querySelectorAll(element)
  let start = performance.now()
  requestAnimationFrame(function animation(time) {
    let fractionOfTime = (time - start) / duration
    if (fractionOfTime > 1) fractionOfTime = 1
    let progress = easeInOut(fractionOfTime, 0, 1)
    elements.forEach(e => {
      e.style.opacity = progress
      e.style.filter = 'blur(' + (1/ progress - 1) + 'px)'
    })
    if (fractionOfTime < 1) requestAnimationFrame(animation)
  })
}

export function blurToFadeIn(element, duration) {
  const elements = document.querySelectorAll(element)
  let start = performance.now()
  requestAnimationFrame(function animation(time) {
    let fractionOfTime = (time - start) / duration
    if (fractionOfTime > 1) fractionOfTime = 1
    let progress = easeInOut(fractionOfTime, 0, 1)
    elements.forEach(e => {
      e.style.opacity = progress
      e.style.filter = 'blur(' + (3/progress - 3) + 'px)'
    })
    if (fractionOfTime < 1) requestAnimationFrame(animation)
  })
}
export function fadeIn(element, duration) {
  const elements = document.querySelectorAll(element)
  let start = performance.now()
  requestAnimationFrame(function animation(time) {
    let fractionOfTime = (time - start) / duration
    if (fractionOfTime > 1) fractionOfTime = 1
    let progress = easeInOut(fractionOfTime, 0, 1)
    elements.forEach(e => e.style.opacity = progress)
    if (fractionOfTime < 1) requestAnimationFrame(animation)
  })
}
export function fadeOut(element, duration) {
  const elements = document.querySelectorAll(element)
  let start = performance.now()
  requestAnimationFrame(function animation(time) {
    let fractionOfTime = (time - start) / duration
    if (fractionOfTime > 1) fractionOfTime = 1
    let progress = easeInOut(fractionOfTime, 1, -1)
    elements.forEach(e => e.style.opacity = progress)
    if (fractionOfTime < 1) requestAnimationFrame(animation)
  })
}
export function partialFadeIn(element, duration, value) {
  const elements = document.querySelectorAll(element)
  let start = performance.now()
  requestAnimationFrame(function animation(time) {
    let fractionOfTime = (time - start) / duration
    if (fractionOfTime > 1) fractionOfTime = 1
    let progress = easeInOut(fractionOfTime, 0, value)
    elements.forEach(e => e.style.opacity = progress)
    if (fractionOfTime < 1) requestAnimationFrame(animation)
  })
}
export function partialFadeOut(element, duration, value) {
  const elements = document.querySelectorAll(element)
  let start = performance.now()
  requestAnimationFrame(function animation(time) {
    let fractionOfTime = (time - start) / duration
    if (fractionOfTime > 1) fractionOfTime = 1
    let progress = easeInOut(fractionOfTime, value, -value)
    elements.forEach(e => e.style.opacity = progress)
    if (fractionOfTime < 1) requestAnimationFrame(animation)
  })
}
export function blur(element, duration) {
  const elements = document.querySelectorAll(element)
  let start = performance.now()
  requestAnimationFrame(function animation(time) {
    let fractionOfTime = (time - start) / duration
    if (fractionOfTime > 1) fractionOfTime = 1
    let progress = easeInOut(fractionOfTime, 0, 1)
    elements.forEach(e => {
      e.style.filter = 'blur(' + (4 * progress) + 'px)'
    })
    if (fractionOfTime < 1) requestAnimationFrame(animation)
  })
}
export function unBlur(element, duration) {
  const elements = document.querySelectorAll(element)
  let start = performance.now()
  requestAnimationFrame(function animation(time) {
    let fractionOfTime = (time - start) / duration
    if (fractionOfTime > 1) fractionOfTime = 1
    let progress = easeInOut(fractionOfTime, 1, -1)
    elements.forEach(e => {
      e.style.filter = 'blur(' + (4 * progress) + 'px)'
    })
    if (fractionOfTime < 1) requestAnimationFrame(animation)
  })
}
export function bobble(element, duration) {
  duration = duration / 7
  let start = performance.now()
  const elements = document.querySelectorAll(element)
  let phase = 0
  let progress
  requestAnimationFrame(function animate(time) {
    let fractionOfTime = (time - start) / duration
    if (fractionOfTime > 1 && phase < 6) {
      fractionOfTime = 0
      start = performance.now()
      phase++
    } else if (fractionOfTime > 1) fractionOfTime = 1
    if(phase===0) progress = easeInOut(fractionOfTime, 1, -0.04)
    else if(phase===1) progress = easeInOut(fractionOfTime, 0.96, 0.06)
    else if(phase===2) progress = easeInOut(fractionOfTime, 1.02, -0.04)
    else if(phase===3) progress = easeInOut(fractionOfTime, 0.98, 0.035)
    else if(phase===4) progress = easeInOut(fractionOfTime, 1.015, -0.02)
    else if(phase===5) progress = easeInOut(fractionOfTime, 0.995, 0.007)
    else if(phase===6) progress = easeInOut(fractionOfTime, 1.002, -0.002)
    elements.forEach(e => e.style.transform = 'scale(' + progress + ')')
    if (fractionOfTime < 1) requestAnimationFrame(animate)
    else elements.forEach(e => e.style.transform = 'scale(' + 1 + ')')
  })
}
export function expandToFadeOut(element, duration) {
  const elements = document.querySelectorAll(element)
  let start = performance.now()
  requestAnimationFrame(function animation(time) {
    let fractionOfTime = (time - start) / duration

    if(fractionOfTime > 1) fractionOfTime = 1
    let progress1 = easeInOut(fractionOfTime, 1, 49)
    let progress2 = easeInOut(fractionOfTime, 1, -1)
    elements.forEach(e => {
      e.style.transform = 'scale(' + progress1 + ')'
      e.style.opacity = progress2
    })
    if(fractionOfTime < 1) requestAnimationFrame(animation)
  })
}
export function zipUp(element, duration) {
  const elements = document.querySelectorAll(element)
  let start = performance.now()
  requestAnimationFrame(function animation(time) {
    let fractionOfTime = (time - start) / duration

    if(fractionOfTime > 1) fractionOfTime = 1
    let progress = easeInOut(fractionOfTime, 0, 1)
    elements.forEach(e => {
      e.style.transform = 'translate(0px, ' + (10/progress-10) + 'px)'
    })
    if(fractionOfTime < 1) requestAnimationFrame(animation)
  })
}
