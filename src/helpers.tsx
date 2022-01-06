const baseFrequency = 16.35159;

const helpers = {
  synth: {
    baseFrequency: baseFrequency,
    indexToFrequency: (index: number):number => baseFrequency * 2**(index/12)
  }
};

export default helpers;