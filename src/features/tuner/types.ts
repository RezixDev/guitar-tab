export type TunerNote = {
  note: string;
  frequency: number;
  string: number;
};

export type TuningStatus = "flat" | "sharp" | "in-tune" | null;

export type TuningId = "standard" | "halfStepDown" | "dropD";
