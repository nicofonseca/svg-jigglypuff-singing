// Powered by greensock.com
// Many thanks to GSAP and its whole team for making the web a funnier place.
// Also, for allowing us to do cool things in an easy way while performing incredible :)

const emiter = new EventEmitter();
const mediaReducedMotion = window.matchMedia(
"(prefers-reduced-motion: reduce)");

let isReducdeMotion = mediaReducedMotion.matches;

const EVENTS = {
  JIGGLYPUFF_TRANSITION_IN: "jigglypuffTransitionIn",
  JIGGLYPUFF_CHANGE_ACCESORY: "jigglypuffChangeAccesory",
  JIGGLYPUFF_REDUCED_MOTION: "jigglypuffReducedMotion",
  PARTICLES_BOUNCE: "particlesBounce",
  SHOW_CONTROL: "showControl",
  PARTICLE_REDUCED_MOTION: "particleReducedMotion" };


const SOUNDS = {
  song: {
    name: "song",
    sound: new Howl({
      src: "https://assets.codepen.io/271665/jigglypuff-song.mp3",
      loop: true,
      volume: 0.45 }) },


  hit: {
    name: "hit",
    sound: new Howl({
      src: "https://assets.codepen.io/271665/jigglypuff-hit.mp3",
      volume: 0.7 }) },


  hit2: {
    name: "hit2",
    sound: new Howl({
      src: "https://assets.codepen.io/271665/jigglypuff-hit-2.mp3",
      volume: 0.7 }) },


  hit3: {
    name: "hit3",
    sound: new Howl({
      src: "https://assets.codepen.io/271665/jigglypuff-hit-3.mp3",
      volume: 0.3 }) } };




const Particle = () => {
  const $element = document.createElementNS(
  "http://www.w3.org/2000/svg",
  "circle");

  let tl = null;

  const animate = () => {
    const duration = gsap.utils.random(6, 10, 1);
    gsap.set($element, {
      cx: "random(0,1920)",
      cy: "random(0,1080)",
      r: "random(30,60)",
      fill: gsap.utils.random(["#fff", "#fdfbea", "#eefdea", "#eaf5fd"]) });


    if (tl) tl.kill();

    tl = gsap.timeline({
      paused: isReducdeMotion,
      onComplete: () => {
        gsap.set($element, {
          y: 0,
          scale: 1 });

        animate();
      },
      delay: gsap.utils.random(0, 6, 1) });

    tl.addLabel("opacity", 0);
    tl.addLabel("move", 0);
    tl.fromTo(
    $element,
    {
      opacity: 0 },

    {
      duration: duration * 0.5,
      opacity: "random(0.5, 0.8)",
      ease: "power2.out" },

    "opacity");

    tl.to(
    $element,
    {
      duration: duration * 0.5,
      opacity: 0,
      ease: "power4.out" },

    `>=opacity`);


    tl.to(
    $element,
    {
      duration,
      y: "-=random(200, 500)",
      scale: `+=random(1.02, 1.1)`,
      transformOrigin: "50% 50%",
      ease: "sine.inOut" },

    "move");

    if (isReducdeMotion) tl.seek(1);
    return tl;
  };

  const toggleAnimation = () => {
    if (isReducdeMotion) {
      tl.pause();
    } else {
      tl.play();
    }
  };

  return { $el: $element, animate, toggleAnimation };
};

const Particles = () => {
  const $el = document.getElementById("particles");
  const $documentFragment = document.createDocumentFragment();
  const totalParticles = gsap.utils.random(15, 30, 1);
  let particles = null;

  const createParticles = () => {
    particles = Array(totalParticles).
    fill().
    map(() => Particle());

    particles.forEach(particle => {
      $documentFragment.appendChild(particle.$el);
    });

    $el.appendChild($documentFragment);
  };

  const animate = particles => {
    particles.forEach(particle => {
      particle.animate();
    });
  };

  const init = () => {
    createParticles();
    animate(particles);
  };

  emiter.on(EVENTS.PARTICLE_REDUCED_MOTION, () => {
    particles.forEach(particle => {
      particle.toggleAnimation();
    });
  });

  emiter.on(EVENTS.PARTICLES_BOUNCE, () => {
    if (isReducdeMotion) return;
    gsap.to($el, {
      keyframes: {
        x: [5, -5, 0],
        y: [2, -2, 0],
        scale: [1.02, 1, 1.01, 1] } });


  });

  init();
};

const Button = ({ $el, onClick = () => {}, toggleActive, isActive }) => {
  const $border = $el.querySelector(".button__border");
  const $background = $el.querySelector(".button__background");
  const $copy = $el.querySelector(".button__copy");
  const activeClass = "button--active";

  if (isActive) $el.classList.add(activeClass);

  const handleMouseEnter = () => {
    if (isReducdeMotion) return;
    gsap.to([$border, $background], {
      keyframes: {
        scaleX: [1, 1.2, 0.8, 1],
        scaleY: [1, 1.3, 0.7, 1.1, 0.9, 1] },

      transformOrigin: "50% 50% 0",
      duration: 0.65,
      ease: "power1.inOut",
      stagger: 0.035 });


    gsap.to($copy, {
      keyframes: {
        scale: [1, 1.025, 0.98, 1] },

      duration: 1,
      ease: "power1.out" });

  };

  const handleClick = () => {
    if (toggleActive) $el.classList.toggle(activeClass);
    onClick();
    if (isReducdeMotion) return;
    gsap.to($el, {
      keyframes: {
        scale: [0.98, 1.04, 1] },

      transformOrigin: "50% 50% 0",
      duration: 0.4,
      ease: "power1.out" });

  };

  const init = () => {
    $el.addEventListener("mouseenter", handleMouseEnter);
    $el.addEventListener("click", handleClick);
  };

  const destroy = () => {
    $el.removeEventListener("mouseenter", handleMouseEnter);
    $el.removeEventListener("click", handleClick);
  };

  init();

  return {
    destroy };

};

const Control = () => {
  const $el = document.getElementById("control-list");
  const $buttons = $el.querySelectorAll(".control-list__button");
  const buttons = [...$buttons].map(($el) =>
  Button({
    $el,
    onClick: () => {
      const id = $el.getAttribute("data-id");
      const isActive = $el.classList.contains("button--active");
      emiter.emit(EVENTS.JIGGLYPUFF_CHANGE_ACCESORY, id, isActive);
    },
    toggleActive: true }));



  emiter.on(EVENTS.SHOW_CONTROLS, () => {
    gsap.to($el, {
      duration: 1,
      autoAlpha: 1,
      delay: 1 });

  });
};

const Jigglypuff = () => {
  const STATES = {
    SING: 0,
    SAD: 1,
    ANGRY: 2,
    SURPRISE: 3 };


  const CSS_VARS = {
    FLOAT_X: "--float-x",
    FLOAT_Y: "--float-y",
    FLOAT_ROTATE: "--float-rotate",
    FLOAT_SCALE: "--float-scale",
    SING_ROTATE: "--sing-rotate",
    X: "--x",
    Y: "--y",
    ROTATE: "--rotate",
    SCALE: "--scale",
    SCALE_X: "--scale-x",
    SCALE_Y: "--scale-y" };


  const TIMELINES = {
    float: null,
    sing: null,
    touch: null,
    start: null };


  const ELEMENTS = {
    background: {
      states: null,
      $el: document.getElementById("background") },

    jigglypuff: {
      states: null,
      $el: document.getElementById("jigglypuff") },

    jigglypuffBackground: {
      states: null,
      $el: document.getElementById("jigglypuff-background") },

    body: {
      states: null,
      $el: document.getElementById("body") },

    hair: {
      states: null,
      $el: document.getElementById("hair") },

    leftEar: {
      states: null,
      $el: document.getElementById("left-ear") },

    rightEar: {
      states: null,
      $el: document.getElementById("right-ear") },

    singHand: {
      states: null,
      $el: document.getElementById("sing-hand") },

    rightHand: {
      states: null,
      $el: document.getElementById("right-hand") },

    leftLeg: {
      states: null,
      $el: document.getElementById("left-leg") },

    rightLeg: {
      states: null,
      $el: document.getElementById("right-leg") },

    eyes: {
      states: [STATES.SING, STATES.SAD, STATES.ANGRY, STATES.SURPRISE],
      $el: document.getElementById("eyes") },

    closeEyes: {
      states: [],
      $el: document.getElementById("close-eyes") },

    sadEyes: {
      states: [STATES.SAD],
      $el: document.getElementById("sad-eyes") },

    angryEyes: {
      states: [STATES.ANGRY],
      $el: document.getElementById("angry-eyes") },

    mouth: {
      states: [STATES.SING],
      $el: document.getElementById("mouth") },

    singMouth: {
      states: [],
      $el: document.getElementById("sing-mouth") },

    sadMouth: {
      states: [STATES.SAD, STATES.SURPRISE],
      $el: document.getElementById("sad-mouth") },

    angryMout: {
      states: [STATES.ANGRY],
      $el: document.getElementById("angry-mouth") },

    hat: {
      sates: null,
      $el: document.getElementById("hat") },

    glasses: {
      states: null,
      $el: document.getElementById("glasses") },

    bow: {
      states: null,
      $el: document.getElementById("bow") },

    singCirclesGroup: {
      state: [STATES.SING],
      $el: document.getElementById("sing-circles") },

    singCircles: {
      states: null,
      $el: document.querySelectorAll(".sing-circle") },

    starsGroup: {
      states: null,
      $el: document.getElementById("stars") },

    stars: {
      states: null,
      $el: document.querySelectorAll(".star") } };



  const DATA = {
    width: 0,
    height: 0,
    originalWidth: 1920,
    originalHeight: 1080,
    windowWidth: 0,
    windowHeight: 0,
    hits: 0,
    computedStyle: getComputedStyle(ELEMENTS.jigglypuff.$el) };


  const stopSound = sound => {
    sound.sound.stop();
  };

  const playSound = sound => {
    sound.sound.play();
  };

  const stopTimeline = timeline => {
    timeline.pause();
    timeline.seek(0);
  };

  const starAnimation = () => {
    const x =
    parseFloat(DATA.computedStyle.getPropertyValue(CSS_VARS.FLOAT_X)) +
    parseFloat(DATA.computedStyle.getPropertyValue(CSS_VARS.X));
    const y =
    parseFloat(DATA.computedStyle.getPropertyValue(CSS_VARS.FLOAT_Y)) +
    parseFloat(DATA.computedStyle.getPropertyValue(CSS_VARS.Y));

    if (isReducdeMotion) {
      gsap.set(ELEMENTS.stars.$el, {
        x: () => x + gsap.utils.random(-180, 180, 10),
        y: () => y - gsap.utils.random(200, 300, 20),
        scale: "random(1.1,1.5)",
        rotate: "random(-120,120,20)",
        transformOrigin: "50% 50% 0" });


      gsap.to(ELEMENTS.stars.$el, {
        stagger: 0.12,
        duration: "random(1.2,1.5)",
        ease: "sine.out",
        keyframes: {
          opacity: [0, 1, 0] } });


      return;
    }

    gsap.fromTo(
    ELEMENTS.stars.$el,
    {
      scale: 0.5,
      x: () => x + gsap.utils.random(-180, 180, 10),
      y: () => y + gsap.utils.random(0, -100, 20) },

    {
      stagger: 0.12,
      duration: "random(1.2,1.5)",
      ease: "sine.out",
      keyframes: {
        opacity: [0, 1, 0] },

      transformOrigin: "50% 50% 0",
      y: () => y - gsap.utils.random(200, 300, 20),
      scale: "random(1.1,1.5)",
      rotate: "random(-120,120,20)" });


  };

  const stepsTl = ($el1, $el2, steps, repeat = -1, yoyo = false) => {
    const tl = gsap.timeline({
      repeat,
      yoyo });


    steps.forEach(step => {
      tl.to(
      $el1,
      {
        opacity: step[0],
        duration: 0 },

      `+=${step[2]}`).
      to($el2, {
        opacity: step[1],
        duration: 0 });

    });

    return tl;
  };

  const floatTl = () => {
    const tl = gsap.timeline({ paused: true });

    const xTl = () => {
      const tl = gsap.timeline({
        repeat: -1 });


      const steps = [
      {
        [CSS_VARS.FLOAT_X]: "random(50,100)",
        duration: 3 },

      {
        [CSS_VARS.FLOAT_X]: "random(-100,-50)",
        duration: 4 }];



      steps.forEach(step => {
        tl.to([ELEMENTS.jigglypuff.$el, ELEMENTS.singCirclesGroup.$el], {
          ...step,
          repeat: 1,
          yoyo: true,
          yoyoEase: "sine.in",
          ease: "sine.out" });

      });

      return tl;
    };

    const yTl = () => {
      const tl = gsap.timeline({
        repeat: -1,
        yoyo: true });

      const steps = [
      {
        [CSS_VARS.FLOAT_Y]: "random(-70,-50)" },

      {
        [CSS_VARS.FLOAT_Y]: "random(50,70)" }];



      steps.forEach(step => {
        tl.to([ELEMENTS.jigglypuff.$el, ELEMENTS.singCirclesGroup.$el], {
          ...step,
          duration: 4,
          ease: "sine.inOut" });

      });

      return tl;
    };

    tl.add(xTl(), 0).
    add(yTl(), 0).
    to(
    [ELEMENTS.jigglypuff.$el, ELEMENTS.singCirclesGroup.$el],
    {
      [CSS_VARS.FLOAT_SCALE]: 1.1,
      duration: 4,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true },

    0).

    to(
    [ELEMENTS.rightLeg.$el, ELEMENTS.leftLeg.$el],
    {
      duration: 4,
      [CSS_VARS.FLOAT_ROTATE]: index => {
        return index === 0 ? 10 : -10;
      },
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut" },

    0);


    return tl;
  };

  const singTl = () => {
    const singCirclesTl = () => {
      const tl = gsap.timeline({
        repeat: -1 });


      tl.to(ELEMENTS.singCircles.$el, {
        opacity: 0,
        duration: i => 3.5 - i * 0.5,
        stagger: -0.4,
        ease: "power4.inOut" }).
      from(
      ELEMENTS.singCircles.$el,
      {
        scale: 0,
        transformOrigin: "50% 50%",
        duration: i => 4 - i * 0.5,
        stagger: -0.4,
        ease: "power3.out" },

      0);


      return tl;
    };

    const eyesTl = () => {
      const steps = [
      [1, 0, 0],
      [0, 1, 1.5],
      [1, 0, 0.2],
      [0, 1, 0.5],
      [1, 0, 3],
      [0, 1, 0.2],
      [1, 0, 0.5]];


      return stepsTl(ELEMENTS.eyes.$el, ELEMENTS.closeEyes.$el, steps);
    };

    const mouthTl = () => {
      const steps = [
      [0, 1, 0],
      [1, 0, 1],
      [0, 1, 0.2],
      [1, 0, 0.5],
      [0, 1, 0.5],
      [1, 0, 1],
      [0, 1, 0.2],
      [1, 0, 0.7],
      [0, 1, 0.15],
      [1, 0, 1],
      [0, 1, 0.2],
      [1, 0, 0.5],
      [0, 1, 0.2],
      [1, 0, 1.4],
      [0, 1, 0.1]];


      return stepsTl(ELEMENTS.mouth.$el, ELEMENTS.singMouth.$el, steps);
    };

    const earsTl = () => {
      const tl = gsap.
      timeline({
        repeat: -1,
        delay: 3,
        repeatDelay: 10 }).

      to([ELEMENTS.leftEar.$el, ELEMENTS.rightEar.$el], {
        duration: 0.15,
        [CSS_VARS.SING_ROTATE]: index => {
          return index === 0 ? -2 : 2;
        },
        repeat: 3,
        yoyo: true,
        ease: "sine.inOut" });


      return tl;
    };

    const tl = gsap.
    timeline({ paused: true }).
    add(eyesTl()).
    add(singCirclesTl(), 0).
    add(mouthTl(), 0).
    add(earsTl(), 0).
    to(
    ELEMENTS.rightHand.$el,
    {
      duration: 3,
      [CSS_VARS.SING_ROTATE]: 5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut" },

    0).

    to(
    ELEMENTS.singHand.$el,
    {
      duration: 4,
      [CSS_VARS.SING_ROTATE]: -5,
      yoyo: true,
      repeat: -1,
      repeatDelay: 1,
      ease: "sine.inOut" },

    0);


    return tl;
  };

  const touchTl = (x, y, onBackToCenter, onComplete) => {
    const tl = gsap.timeline({
      onComplete });


    const durations = {
      x: gsap.utils.random(1, 2),
      y: gsap.utils.random(1, 2),
      rotate: gsap.utils.random(1, 2) };


    const minDuration = Math.min(durations.x, durations.y, durations.rotate);

    const steps = [
    {
      $el: [ELEMENTS.jigglypuff.$el],
      to: {
        duration: durations.x,
        [CSS_VARS.X]: `+=${x}`,
        ease: "power3.out" } },


    {
      $el: [ELEMENTS.jigglypuff.$el],
      to: {
        duration: durations.y,
        [CSS_VARS.Y]: `+=${y}`,
        ease: "power3.out" } },


    {
      $el: [ELEMENTS.jigglypuff.$el],
      to: {
        duration: durations.rotate,
        [CSS_VARS.ROTATE]: `+=${x * 0.5}`,
        ease: "power1.out" } },


    {
      $el: [ELEMENTS.jigglypuff.$el],
      from: {
        [CSS_VARS.SCALE_X]: isReducdeMotion ? 1 : 1.3 },

      to: {
        duration: 0.5,
        [CSS_VARS.SCALE_X]: 1,
        ease: "elastic.out(1,0.7)" } },


    {
      $el: [ELEMENTS.jigglypuff.$el],
      from: {
        [CSS_VARS.SCALE_Y]: isReducdeMotion ? 1 : 1.4 },

      to: {
        duration: 0.85,
        [CSS_VARS.SCALE_Y]: 1,
        ease: "elastic.out(1,0.9)" } },


    {
      $el: [
      ELEMENTS.rightEar.$el,
      ELEMENTS.leftEar.$el,
      ELEMENTS.rightHand.$el,
      ELEMENTS.singHand.$el,
      ELEMENTS.rightLeg.$el,
      ELEMENTS.leftLeg.$el,
      ELEMENTS.hair.$el],

      from: {
        [CSS_VARS.ROTATE]: index => {
          return isReducdeMotion ? 0 : index % 2 === 0 ? 40 : -40;
        },
        [CSS_VARS.SCALE]: isReducdeMotion ? 1 : 0.7 },

      to: {
        duration: 0.65,
        [CSS_VARS.ROTATE]: 0,
        [CSS_VARS.SCALE]: 1,
        ease: "elastic.out(1,0.7)" } }];




    steps.forEach(step => {
      if (step.from && step.to) {
        tl.fromTo(
        [...step.$el],
        {
          ...step.from },

        {
          ...step.to },

        0);

        return;
      }
      tl.to(
      [...step.$el],
      {
        ...step.to },

      0);

    });

    tl.to(
    ELEMENTS.jigglypuff.$el,
    {
      duration: 3,
      [CSS_VARS.ROTATE]: 0,
      [CSS_VARS.X]: 0,
      [CSS_VARS.Y]: 0,
      ease: "back.out(3)",
      onStart: onBackToCenter },

    minDuration);


    return tl;
  };

  const startTl = () => {
    const tl = gsap.timeline({
      paused: true,
      delay: 1,
      onStart: () => playSound(SOUNDS.song) });


    gsap.set([ELEMENTS.jigglypuff.$el, ELEMENTS.singCirclesGroup.$el], {
      opacity: 1 });


    tl.to([ELEMENTS.jigglypuff.$el, ELEMENTS.singCirclesGroup.$el], {
      [CSS_VARS.Y]: 0,
      duration: 10,
      ease: "sine.out" });

    return tl;
  };

  const changeState = state => {
    for (const [key, value] of Object.entries(ELEMENTS)) {
      if (value.states) {
        const currentState = value.states.some(s => s === state);
        gsap.set(value.$el, {
          opacity: currentState ? 1 : 0 });

      }
    }
  };

  const changeAccesory = (accesory, isActive) => {
    if (ELEMENTS[accesory])
    ELEMENTS[accesory].$el.style.opacity = isActive ? 1 : 0;

    if (accesory === "shiny") ELEMENTS.eyes.$el.classList.toggle("eyes--shiny");

    gsap.to(ELEMENTS.jigglypuff.$el, {
      keyframes: {
        [CSS_VARS.SCALE_X]: isReducdeMotion ? 1 : [0.96, 1.02, 1],
        [CSS_VARS.SCALE_Y]: isReducdeMotion ? 1 : [1.06, 0.95, 1] },

      duration: 0.65,
      ease: "sine.out" });

    starAnimation();
    playSound(SOUNDS.hit3);
  };

  const handleClick = event => {
    if (TIMELINES.touch) TIMELINES.touch.kill();
    TIMELINES.touch = null;
    if (TIMELINES.start) {
      TIMELINES.start.kill();
      TIMELINES.start = null;
      gsap.set(ELEMENTS.singCirclesGroup.$el, {
        [CSS_VARS.Y]: 0 });

    }

    stopTimeline(TIMELINES.sing);

    stopSound(SOUNDS.song);
    playSound(SOUNDS.hit2);

    DATA.hits += 1;

    const { clientX, clientY } = event;
    const {
      top,
      left,
      width,
      height } =
    ELEMENTS.jigglypuffBackground.$el.getBoundingClientRect();
    const x = (width * 0.5 + left - clientX) * 2;
    const y = (height * 0.5 + top - clientY) * 3.5;

    if (DATA.hits >= 5) {
      changeState(STATES.ANGRY);
    } else {
      playSound(SOUNDS.hit);

      changeState(STATES.SAD);
    }

    emiter.emit(EVENTS.PARTICLES_BOUNCE);

    TIMELINES.touch = touchTl(
    x,
    y,
    () => {
      // On back to the center
      changeState(STATES.SURPRISE);
    },
    () => {
      // On complete
      DATA.hits = 0;
      changeState(STATES.SING);
      playSound(SOUNDS.song);
      TIMELINES.sing.play();
    });

  };

  const handleUpdate = () => {
    const x = DATA.computedStyle.getPropertyValue(CSS_VARS.FLOAT_X) * 0.1;
    const y = DATA.computedStyle.getPropertyValue(CSS_VARS.FLOAT_Y);
    ELEMENTS.jigglypuff.$el.style.setProperty(CSS_VARS.FLOAT_ROTATE, -x);
    ELEMENTS.hair.$el.style.setProperty(CSS_VARS.FLOAT_ROTATE, x);
    ELEMENTS.hair.$el.style.setProperty(CSS_VARS.FLOAT_Y, -y * 0.075);
  };

  const handleResize = () => {
    const { width, height } = ELEMENTS.jigglypuffBackground.$el.getBBox();
    const backgroundGBCR = ELEMENTS.background.$el.getBoundingClientRect();
    const backgroundWidth = backgroundGBCR.width;
    const backgroundHeight = backgroundGBCR.height;

    const diffWidth = backgroundWidth / window.innerWidth;
    const diffHeight = backgroundHeight / window.innerHeight;

    DATA.windowWidth =
    DATA.originalWidth -
    (DATA.originalWidth - DATA.originalWidth / diffWidth) * 0.5;

    DATA.windowHeight =
    DATA.originalHeight -
    (DATA.originalHeight - DATA.originalHeight / diffHeight) * 0.5;

    DATA.width = width;
    DATA.height = height;
  };

  const handleTransitionIn = () => {
    TIMELINES.start.play();
    TIMELINES.float.play();
    TIMELINES.sing.play();
    emiter.emit(EVENTS.SHOW_CONTROLS);

    if (isReducdeMotion)
    gsap.set(ELEMENTS.singCirclesGroup.$el, { opacity: 0 });
  };

  const addEventsListeners = () => {
    ELEMENTS.jigglypuffBackground.$el.addEventListener("click", handleClick);
    window.addEventListener("resize", handleResize);
  };

  const init = () => {
    TIMELINES.float = floatTl();
    TIMELINES.sing = singTl();
    TIMELINES.start = startTl();
    addEventsListeners();
    handleResize();
    gsap.set([ELEMENTS.jigglypuff.$el, ELEMENTS.singCirclesGroup.$el], {
      [CSS_VARS.Y]: -DATA.windowHeight * 0.5 - DATA.height * 0.5 });

    gsap.ticker.add(handleUpdate);
  };

  emiter.on(EVENTS.JIGGLYPUFF_TRANSITION_IN, () => {
    handleTransitionIn();
  });

  emiter.on(EVENTS.JIGGLYPUFF_REDUCED_MOTION, () => {
    gsap.set(ELEMENTS.singCirclesGroup.$el, {
      opacity: isReducdeMotion ? 0 : 1 });

  });

  emiter.on(EVENTS.JIGGLYPUFF_CHANGE_ACCESORY, changeAccesory);

  init();
};

const $startButton = document.getElementById("start-button");
const $soundButton = document.getElementById("sound-button");

const particles = Particles();
const jigglypuff = Jigglypuff();
const control = Control();

const startButton = Button({
  $el: $startButton,
  onClick: () => {
    gsap.to($startButton, {
      opacity: 0,
      duration: 0.5,
      ease: "power2.out",
      onComplete: () => {
        startButton.destroy();
        $startButton.parentElement.removeChild($startButton);
      } });

    emiter.emit(EVENTS.JIGGLYPUFF_TRANSITION_IN);
  } });


const soundButton = Button({
  $el: $soundButton,
  onClick: () => {
    Object.keys(SOUNDS).forEach(key => {
      const sound = SOUNDS[key].sound;
      if (sound.mute()) {
        sound.mute(false);
      } else {
        sound.mute(true);
      }
    });
  },
  toggleActive: true });


mediaReducedMotion.addEventListener("change", () => {
  isReducdeMotion = mediaReducedMotion.matches;
  emiter.emit(EVENTS.PARTICLE_REDUCED_MOTION);
  emiter.emit(EVENTS.JIGGLYPUFF_REDUCED_MOTION);
});