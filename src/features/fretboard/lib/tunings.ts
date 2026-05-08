import {
  dropDTuning,
  halfStepDownTuning,
  standardTuning,
} from "@shared/music/notes";
import type { Tuning } from "@shared/types/music";
import type { TuningId } from "../components/TuningSelector";

const TUNINGS_BY_ID: Record<TuningId, Tuning> = {
  standard: standardTuning,
  halfStepDown: halfStepDownTuning,
  dropD: dropDTuning,
};

export const tuningById = (id: TuningId): Tuning => TUNINGS_BY_ID[id];
