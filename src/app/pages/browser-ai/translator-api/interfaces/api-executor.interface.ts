import {RequirementInterface} from './requirement.interface';
import {StepStatus} from '../../../../enums/step-status.enum';

export interface ApiExecutorInterface {
  checkRequirements(): RequirementInterface;

  executeStep1(sourceLanguage: string, targetLanguage: string, callback?: (progress: {bytesDownloaded: number, totalBytes: number}) => void): Promise<{log: string; status: StepStatus}>;

  getStep1Code(sourceLanguage: string | null, targetLanguage?: string | null): string;
}
