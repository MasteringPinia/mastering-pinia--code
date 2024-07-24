export enum Grade {
  /**
   * Repeat the card again during this session
   */
  Again = 0,
  /**
   * The card was difficult to remember. It will be repeated more often in the future
   */
  Hard = 1,
  /**
   * The card was easy to remember. It will be repeated less often in the future
   */
  Good = 2,
  /**
   * The card was very easy to remember. It will be repeated even less often in the future
   */
  Easy = 3,
}

export const GRADE_MAX = Grade.Easy
