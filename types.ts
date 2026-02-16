
export type ViewName = 'home' | 'planner' | 'performer' | 'analyzer' | 'about' | 'faq';

export interface Deviation {
  md: number;
  angle: number;
}

export interface CompletionEquipment {
  item: string;
  top: number;
  comments?: string;
  isProblem?: boolean;
  restriction?: number; // % of ID reduction, e.g., 0.3 for 30%
}

export interface CompletionItem {
  type: string;
  size: string;
  top: number;
  bottom: number;
  isProblem?: boolean;
}

export interface Completion {
  casing: CompletionItem[];
  tubing: CompletionItem[];
  equipment: CompletionEquipment[];
  perforations: { top: number; bottom: number }[];
}

export interface WellHistory {
  date: string;
  operation: string;
  problem: string;
  lesson: string;
}

export interface Well {
  id: string;
  name: string;
  field: string;
  region?: string;
  type?: string;
  depth?: string;
  status: string;
  issue: string;
  history: WellHistory[];
  deviation?: Deviation[];
  completion?: Completion;
}

export interface Objective {
  id: string;
  name: string;
  description: string;
}

export interface Problem {
  id: string;
  name: string;
  linked_objectives: string[];
}

export interface AiRecommendation {
  objectiveId: string;
  confidence: number;
  outcome: string;
  reason: string;
}

export type ConveyanceType = 'Coiled Tubing' | 'E-Line' | 'Slickline';

export interface TfaModel {
  pickUp: number[][];
  slackOff: number[][];
  alarmUpper: number[][];
  alarmLower: number[][];
}

export interface Procedure {
  name: string;
  conveyance: ConveyanceType;
  toolWeight: number; // in lbs
  frictionCoefficient: number;
  steps: string[];
  tfaModel: TfaModel;
}

export interface ProcedureStep {
  id: number;
  text: string;
  completed: boolean;
  active: boolean;
}

export interface LiveData {
  depth: number;
  weight: number; // k-lbs for CT/E-Line, lbs for Slickline
  speed: number; // ft/min
  pressure: number; // psi
  currentStep: number;
  jobRunning: boolean;
  alarmState: 'none' | 'warning' | 'danger';
  npt: number;
  opTime: number;
}

export interface AppState {
  currentView: ViewName;
  isAuthenticated: boolean;
  theme: 'light' | 'dark';
  selectedWell: Well | null;
  selectedObjective: Objective | null;
  generatedPlan: Procedure | null;
  simulationResult: LiveData | null;
  lessonsLearned: string[];
  modalWell: Well | null;
}
