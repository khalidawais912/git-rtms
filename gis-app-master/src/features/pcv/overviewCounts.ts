/** GET /api/pcv/overview/counts */
export interface PcvOverviewCounts {
  total: number;
  inProcess: number;
  submitted: number;
  referredBack: number;
  approvedBySecretary: number;
  approvedByDg: number;
  completed: number;
  markedToEvaluation: number;
  cancelled: number;
}

/** PC-V numbers for the secretary dashboard tiles; undefined is shown as "–". */
export interface PcvTileCounts {
  total?: number;
  submittedToDgme?: number;
  takeUp?: number;
}

/** Overview counts → tiles. Attached Dept. and Referback count the rows of their tabs instead. */
export const toPcvTileCounts = (counts?: Partial<PcvOverviewCounts> | null): PcvTileCounts => ({
  total: counts?.total,
  submittedToDgme: counts?.approvedBySecretary,
  takeUp: counts?.markedToEvaluation,
});
