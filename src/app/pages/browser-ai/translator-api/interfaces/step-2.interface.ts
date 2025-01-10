import {StepStatus} from '../../../../enums/step-status.enum';

export interface Step2 {
  status: StepStatus,
  sourceLanguage: string;
  targetLanguage: string;
  content: string;
  translatedContent: string;
  outputCollapsed: boolean
  log: string;
}
