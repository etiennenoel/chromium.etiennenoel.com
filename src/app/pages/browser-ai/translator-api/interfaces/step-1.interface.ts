import {StepStatus} from '../../../../enums/step-status.enum';

export interface Step1 {
  status: StepStatus,
  totalBytes: number;
  bytesDownloaded: number;
  outputCollapsed: boolean
  log: string;
}
