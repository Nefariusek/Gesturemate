type FingerName = 'Thumb' | 'Index' | 'Middle' | 'Ring' | 'Pinky';
type FingerState = 'No Curl' | 'Half Curl' | 'Full Curl';
type FingerDirection =
  | 'Horizontal Left'
  | 'Horizontal Right'
  | 'Vertical Up'
  | 'Vertical Down'
  | 'Diagonal Up Left'
  | 'Diagonal Up Right'
  | 'Diagonal Down Left'
  | 'Diagonal Down Right';

class FingerPose {
  fingerName: FingerName;
  fingerState: FingerState;
  fingerDirection: FingerDirection;

  constructor(name: FingerName, state: FingerState, direction: FingerDirection) {
    this.fingerName = name;
    this.fingerState = state;
    this.fingerDirection = direction;
  }
}
