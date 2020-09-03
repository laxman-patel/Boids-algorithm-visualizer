import "../styles/index.scss";
import { getRandomInt } from "./utils";
import Boid from "./Boid";

if (process.env.NODE_ENV === "development") {
  require("../index.html");
}

export let width = window.innerWidth;
export let height = window.innerHeight;

let canvas = document.querySelector("canvas");

let alignmentSlider = document.getElementById("alignmentSlider");
let cohesionSlider = document.getElementById("cohesionSlider");
let separationSlider = document.getElementById("separationSlider");

let alignmentVal = alignmentSlider.value;
let cohesionVal = cohesionSlider.value;
let separationVal = separationSlider.value;

alignmentSlider.addEventListener("change", () => {
  alignmentVal = alignmentSlider.value;
});

cohesionSlider.addEventListener("change", () => {
  cohesionVal = cohesionSlider.value;
});

separationSlider.addEventListener("change", () => {
  separationVal = separationSlider.value;
});

canvas.width = width;
canvas.height = height;

export let c = canvas.getContext("2d");

let boidsArr = [];
let numBoids = 200;

const colors = ["#ffbe0b", "#fb5607", "#ff006e", "#8338ec", "#3a86ff"];

for (let i = 0; i < numBoids; i++) {
  boidsArr.push(
    new Boid(c, colors[getRandomInt(1, colors.length)], getRandomInt(1, 3))
  );
}

function animate() {
  requestAnimationFrame(animate);

  c.fillStyle = " rgba(1, 1, 10, 0.2) ";
  c.fillRect(0, 0, width, height);

  boidsArr.forEach((boid) => {
    boid.execute(boidsArr, alignmentVal, cohesionVal, separationVal);
  });
}

animate();
