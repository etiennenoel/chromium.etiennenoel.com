import {StepStatus} from '../../../../enums/step-status.enum';

export interface Step0 {
  status: StepStatus,
  available: string;
  outputCollapsed: boolean;
  log: string;
}
