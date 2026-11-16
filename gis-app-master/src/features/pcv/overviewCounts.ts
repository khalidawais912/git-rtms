/** GET /api/pcv/overview/counts: one count per status; the eight statuses add up to total. */
export interface PcvOverviewCounts {
  total: number;
  inProcess: number;
  submitted: number;
  referredBack: number;
  approvedBySecretary: number;
  approvedByDg: number;
  completed: number;
  markedForImpactAssessment: number;
  /** Older name of markedForImpactAssessment, read when a server still sends it. */
  markedToEvaluation?: number;
  cancelled: number;
}

type Counts = Partial<PcvOverviewCounts> | null | undefined;

const impactAssessment = (c: Counts) => c?.markedForImpactAssessment ?? c?.markedToEvaluation;

const sum = (...values: (number | undefined)[]) =>
  values.every((v) => v === undefined) ? undefined : values.reduce<number>((n, v) => n + (v ?? 0), 0);

/** PC-V numbers for the secretary dashboard tiles; undefined is shown as "–". */
export interface PcvTileCounts {
  total?: number;
  submittedToDgme?: number;
  takeUp?: number;
}

/** Overview counts → tiles. Attached Dept. and Referback count the rows of their tabs instead. */
export const toPcvTileCounts = (counts?: Counts): PcvTileCounts => ({
  total: counts?.total,
  submittedToDgme: counts?.approvedBySecretary,
  takeUp: impactAssessment(counts),
});

/** PC-V numbers for the Evaluation Dashboard tiles. */
export interface PcvEvaluationCounts {
  submittedByDept?: number;
  inProgress?: number;
  assigned?: number;
  referBack?: number;
}

/**
 * Overview counts → Evaluation Dashboard tiles: Submitted = submitted by the department;
 * In Progress = with DGM&E (approved by the Secretary or by the DG); Assigned = marked for
 * impact assessment; Refer Back = referred back.
 */
export const toPcvEvaluationCounts = (counts?: Counts): PcvEvaluationCounts => ({
  submittedByDept: counts?.submitted,
  inProgress: sum(counts?.approvedBySecretary, counts?.approvedByDg),
  assigned: impactAssessment(counts),
  referBack: counts?.referredBack,
});
