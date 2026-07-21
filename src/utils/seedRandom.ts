export class SeededRandom {
  private seed: number;

  constructor(seedStr: string) {
    this.seed = this.hashString(seedStr);
  }

  private hashString(str: string): number {
    let hash = 1789;
    if (str.length === 0) return hash;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }

  // Returns a float between 0 and 1
  next(): number {
    // LCG (Linear Congruential Generator) parameters
    this.seed = (this.seed * 1664525 + 1013904223) % 4294967296;
    return this.seed / 4294967296;
  }

  // Returns an integer between min (inclusive) and max (exclusive)
  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min)) + min;
  }

  // Pick a random element from an array
  pick<T>(arr: T[]): T {
    if (!arr || arr.length === 0) return undefined as any;
    return arr[this.nextInt(0, arr.length)];
  }

  // Shuffles an array and returns a shuffled copy
  shuffle<T>(arr: T[]): T[] {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = this.nextInt(0, i + 1);
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }
}
