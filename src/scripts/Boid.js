import Victor from "victor";
import { width, height } from "./index";
import { getRandomFloat, setMagnitude, limit } from "./utils";

class Boid {
  constructor(c, color, radius) {
    this.position = new Victor(
      getRandomFloat(0, width),
      getRandomFloat(0, height)
    );
    this.velocity = new Victor(1, 1).rotateByDeg(getRandomFloat(0, 360));
    setMagnitude(this.velocity, getRandomFloat(2, 4));

    this.acceleration = new Victor();
    this.perceptionRadius = 50;

    this.c = c;
    this.color = color;
    this.radius = radius;
    this.maxForce = 0.02;
    this.maxSpeed = 10;
  }

  bound() {
    if (this.position.x > width) {
      this.position.x = 0;
    } else if (this.position.x < 0) {
      this.position.x = width;
    }

    if (this.position.y > height) {
      this.position.y = 0;
    } else if (this.position.y < 0) {
      this.position.y = height;
    }

    /* if (
      this.position.x + this.velocity.x > width - this.radius ||
      this.position.x + this.velocity.x < this.radius
    ) {
      this.velocity.x = -this.velocity.x;
    }

    if (
      this.position.y + this.velocity.y > height - this.radius ||
      this.position.y + this.velocity.y < this.radius
    ) {
      this.velocity.y = -this.velocity.y;
    } */
  }

  update() {
    this.position.add(this.velocity);
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed, this.maxSpeed);
    this.acceleration.multiplyScalar(0);
  }

  align(boidsArr) {
    let steering = new Victor();

    let total = 0;

    boidsArr.forEach((otherBoid) => {
      let d = this.position.distance(otherBoid.position);

      if (otherBoid !== this && d < this.perceptionRadius) {
        steering.add(otherBoid.velocity);
        total++;
      }
    });

    if (total > 0) {
      steering.divideScalar(total);
      setMagnitude(steering, this.maxSpeed);
      steering.subtract(this.velocity);

      /* limit(steering, this.maxForce); */
      steering.limit(this.maxForce, this.maxForce);
    }

    return steering;
  }

  cohesion(boidsArr) {
    let steering = new Victor();

    let total = 0;

    boidsArr.forEach((otherBoid) => {
      let d = this.position.distance(otherBoid.position);

      if (otherBoid !== this && d < this.perceptionRadius) {
        steering.add(otherBoid.position);
        total++;
      }
    });

    if (total > 0) {
      steering.divideScalar(total);
      steering.subtract(this.position);
      setMagnitude(steering, this.maxSpeed);
      steering.subtract(this.velocity);
      steering.limit(this.maxForce, this.maxForce);
    }

    return steering;
  }

  separation(boidsArr) {
    let steering = new Victor();

    let total = 0;

    boidsArr.forEach((otherBoid) => {
      let d = this.position.distance(otherBoid.position);

      if (otherBoid !== this && d < this.perceptionRadius) {
        let diff = new Victor(this.position.x, this.position.y).subtract(
          otherBoid.position
        );

        diff.multiplyScalar(1 / d);

        steering.add(diff);
        total++;
      }
    });

    if (total > 0) {
      steering.divideScalar(total);

      setMagnitude(steering, this.maxSpeed);
      steering.subtract(this.velocity);
      steering.limit(this.maxForce, this.maxForce);
    }

    return steering;
  }

  draw() {
    const c = this.c;
    const x = this.position.x;
    const y = this.position.y;

    c.beginPath();
    c.arc(x, y, this.radius, 0, 2 * Math.PI, false);
    c.fillStyle = this.color;
    c.fill();
  }

  flock(boidsArr, alignmentVal, cohesionVal, separationVal) {
    let alignment = this.align(boidsArr);
    alignment.multiplyScalar(alignmentVal / 10);

    let cohesion = this.cohesion(boidsArr);
    cohesion.multiplyScalar(cohesionVal / 10);

    let separation = this.separation(boidsArr);
    separation.multiplyScalar(separationVal / 10);

    this.acceleration.add(separation);
    this.acceleration.add(alignment);
    this.acceleration.add(cohesion);
  }

  execute(boidsArr, alignmentVal, cohesionVal, separationVal) {
    this.bound();
    this.flock(boidsArr, alignmentVal, cohesionVal, separationVal);
    this.update();
    this.draw();
  }
}

export default Boid;
