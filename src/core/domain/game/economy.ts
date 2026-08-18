/**
 * Centralized peso scale — placeholder balance, not final numbers. Content
 * references these constants instead of writing raw amounts, so a future
 * balancing pass only has to touch this file. All amounts are integers.
 */
export const MONEY_SCALE = {
  PUNTERO_STARTING: 500_000,
  LIBERAL_STARTING: 2_000_000,
  LOCAL_FAVOR: 150_000,
  SMALL_CAMPAIGN_COST: 800_000,
  BUSINESS_FINANCING: 3_000_000,
  MONTHLY_ALLOWANCE_CONCEJAL: 900_000,
  RIGGED_BID_PAYOUT: 15_000_000,
  BRIBE_TO_JOURNALIST: 4_000_000,
  MAJOR_CAMPAIGN_COST: 25_000_000,
  COVERUP_PAYMENT: 4_000_000,
  LEGAL_CONTACTS: 2_500_000,
  UNION_SETTLEMENT: 3_500_000,
  MEDIA_OPERATION: 2_000_000,
  JOINT_VENTURE_RETURN: 6_000_000,
} as const
