import {RequirementInterface} from './interfaces/requirement.interface';
import {ApiExecutorInterface} from './interfaces/api-executor.interface';
import {RequirementStatus} from '../../../enums/requirement-status.enum';
import {isPlatformBrowser} from '@angular/common';
import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {StepStatus} from '../../../enums/step-status.enum';
import {Step0} from './interfaces/step-0.interface';

@Injectable()
export class CurrentApiExecutor implements ApiExecutorInterface {

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
  }

  checkRequirements(): RequirementInterface {
    let translationApiStatus: RequirementStatus;
    let translationApiMessage: string;

    // Check if the translation API flag is enabled
    // @ts-ignore
    if (isPlatformBrowser(this.platformId) && (!window.hasOwnProperty('translation') || window.translation.hasOwnProperty('createTranslator'))) {
      translationApiStatus = RequirementStatus.Fail;
      translationApiMessage = "'window.translation' is not defined. Activate the flag.";
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

  async executeStep0(sourceLanguage: string, targetLanguage: string): Promise<Step0> {
    // @ts-ignore
    const canTranslate = await window.translation.canTranslate({
      sourceLanguage,
      targetLanguage,
    });

    return {
      log: `Result of canTranslate: '${canTranslate}'.`,
      status: StepStatus.Completed,
      available: canTranslate,
      outputCollapsed: false,
    }
  }

  getStep0Code(sourceLanguage: string | null, targetLanguage?: string | null): string {
    return "const canTranslate = await translation.canTranslate({\n" +
      "  sourceLanguage: '" + sourceLanguage + "',\n" +
      "  targetLanguage: '" + targetLanguage + "',\n" +
      "});\n\n" +
      "console.log(\`Result of canTranslate: '${canTranslate}'.`);";
  }

  executeStep1(sourceLanguage: string, targetLanguage: string, callback?: (progress: {
    bytesDownloaded: number,
    totalBytes: number
  }) => void): Promise<{ log: string; status: StepStatus }> {
    return new Promise<{ log: string, status: StepStatus }>(async (resolve, reject) => {
      try {
        // @ts-ignore
        const translator = await window.translation.createTranslator({
          sourceLanguage,
          targetLanguage,
        });

        translator.ondownloadprogress = (progressEvent: any) => {
          callback?.({
            bytesDownloaded: progressEvent.loaded,
            totalBytes: progressEvent.total,
          });
        };

        return resolve({
          log: "Translator created.",
          status: StepStatus.Completed,
        });

      } catch (e: any) {
        return resolve({
          log: `Error: ${e.message}`,
          status: StepStatus.Error,
        })
      }
    });
  }

  getStep1Code(sourceLanguage: string | null, targetLanguage: string | null): string {
    return "const translator = await window.translation.createTranslator({\n" +
      "  sourceLanguage: '" + sourceLanguage + "',\n" +
      "  targetLanguage: '" + targetLanguage + "',\n" +
      "});\n" +
      "\n" +
      "translator.ondownloadprogress = (progressEvent: any) => {\n" +
      "  callback?.({\n" +
      "    bytesDownloaded: progressEvent.loaded,\n" +
      "    totalBytes: progressEvent.total,\n" +
      "  });\n" +
      "};";
  }

}
