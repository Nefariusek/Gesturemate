export class PoseData {
  finger: string;
  curl: string;
  direction: string;

  constructor(finger: string, curl: string, direction: string) {
    this.finger = finger;
    this.curl = curl;
    this.direction = direction;
  }

  static fromJson(json: any[]): PoseData {
    if (json.length !== 3) {
      throw new Error('Invalid pose data');
    }
    return new PoseData(json[0], json[1], json[2]);
  }
}
