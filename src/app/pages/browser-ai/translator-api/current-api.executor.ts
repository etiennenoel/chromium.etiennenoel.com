import {RequirementInterface} from './interfaces/requirement.interface';
import {ApiExecutorInterface} from './interfaces/api-executor.interface';
import {RequirementStatus} from '../../../enums/requirement-status.enum';
import {isPlatformBrowser} from '@angular/common';
import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {StepStatus} from '../../../enums/step-status.enum';

@Injectable()
export class CurrentApiExecutor implements ApiExecutorInterface {

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
  }

  checkRequirements(): RequirementInterface {
    let translationApiStatus: RequirementStatus;
    let translationApiMessage: string;

    // Check if the translation API flag is enabled
    if(isPlatformBrowser(this.platformId) && !window.hasOwnProperty('translator')) {
      translationApiStatus = RequirementStatus.Fail;
      translationApiMessage = "'window.translator' is not defined. Activate the flag.";
    } else {
      translationApiStatus = RequirementStatus.Pass;
      translationApiMessage = "Passed";
    }

    return {
      translationApiFlag: {
        status: translationApiStatus,
        message: translationApiMessage
      }
    }
  }

  executeStep1(sourceLanguage: string, targetLanguage: string, callback?: (progress: {bytesDownloaded: number, totalBytes: number}) => void):  Promise<{log: string; status: StepStatus}> {
    return new Promise<{log: string, status: StepStatus}>((resolve, reject) => {

    });
  }

  getStep1Code(sourceLanguage: string | null, targetLanguage: string | null): string {
    return "";
  }

}
