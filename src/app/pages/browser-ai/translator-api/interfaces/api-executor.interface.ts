import {RequirementInterface} from './requirement.interface';
import {StepStatus} from '../../../../enums/step-status.enum';
import {Step0} from './step-0.interface';

export interface ApiExecutorInterface {
  checkRequirements(): RequirementInterface;

  executeStep0(sourceLanguage: string, targetLanguage: string): Promise<Step0>;

  getStep0Code(sourceLanguage: string | null, targetLanguage?: string | null): string;

  executeStep1(sourceLanguage: string, targetLanguage: string, callback?: (progress: {bytesDownloaded: number, totalBytes: number}) => void): Promise<{log: string; status: StepStatus}>;

  getStep1Code(sourceLanguage: string | null, targetLanguage?: string | null): string;

  executeStep2(sourceLanguage: string, targetLanguage: string, content:string | null): Promise<{log: string; translatedContent: string, status: StepStatus}>;

  getStep2Code(sourceLanguage: string | null, targetLanguage: string | null, content:string | null): string;
}
