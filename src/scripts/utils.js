export function getRandomInt(min, max, exclude = 0) {
  min = Math.ceil(min);
  max = Math.floor(max);
  const result = Math.floor(Math.random() * (max - min + 1)) + min;

  if (result === exclude) {
    getRandomInt(min, max, exclude);
  } else {
    return result;
  }
}

export function getRandomFloat(min, max) {
  return min + Math.random() * (max - min);
}

export function limit(vec, max) {
  let vecSq = vec.lengthSq();

  if (vecSq > max * max) {
    vec.divide(Math.sqrt(vecSq)).multiplyScalar(max);
  }
}

export function setMagnitude(vec, mag) {
  return vec.normalize().multiplyScalar(mag);
}
