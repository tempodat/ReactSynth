export interface SynthOption<T> {
  value: T;
  change: (value: T) => void;
}

export interface IDictionary {
  [key: string]: any;
}

export interface ISynthSettings {
  waveform: SynthOption<string>;
  volume: SynthOption<number>;
  enabled: SynthOption<boolean>;
  octave: SynthOption<number>;
  [key: string]: any;
}

export interface IVoiceOptions {
  index? : number;
  octave? : number;
  enabled? : boolean;
  waveform? : string;
}

