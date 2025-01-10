import {ApiExecutorInterface} from './interfaces/api-executor.interface';
import {RequirementInterface} from './interfaces/requirement.interface';
import {RequirementStatus} from '../../../enums/requirement-status.enum';
import {isPlatformBrowser} from '@angular/common';
import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {StepStatus} from '../../../enums/step-status.enum';
import {Step0} from './interfaces/step-0.interface';

@Injectable()
export class ExplainerApiExecutor implements ApiExecutorInterface{
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
  }

  checkRequirements(): RequirementInterface {
    let translationApiStatus: RequirementStatus;
    let translationApiMessage: string;

    // Check if the translation API flag is enabled
    if(isPlatformBrowser(this.platformId) && !window.hasOwnProperty('ai')) {
      translationApiStatus = RequirementStatus.Fail;
      translationApiMessage = "'window.ai' is not defined. Activate the flag.";
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
    return {
      log: "",
      status: StepStatus.Completed,
      available: "false",
      outputCollapsed: false,
    }
  }

  getStep0Code(sourceLanguage: string | null, targetLanguage?: string | null): string {
    return "";
  }

  executeStep1(sourceLanguage: string, targetLanguage: string, callback?: (progress: {bytesDownloaded: number, totalBytes: number}) => void):  Promise<{log: string; status: StepStatus}> {
    return new Promise<{log: string; status: StepStatus}>(async (resolve) => {
      try {
        // @ts-ignore
        const translator = await ai.translator.create({
          sourceLanguage: sourceLanguage,
          targetLanguage: targetLanguage,
          monitor(m: any) {
            m.addEventListener("downloadprogress", (e: any) => {
              callback?.({
                bytesDownloaded: e.loaded,
                totalBytes: e.total,
              });
            });
          },
        });
      } catch (e: any) {
        return resolve({
          log: `There was an error executing the command. Error: ${e.message}`,
          status: StepStatus.Error,
        })
      }
    });

  }

  getStep1Code(sourceLanguage: string | null, targetLanguage: string | null): string {
    return "const translator = await ai.translator.create({\n" +
      "    sourceLanguage: \"" + sourceLanguage + "\",\n" +
      "    targetLanguage: \"" + targetLanguage + "\",\n" +
      "    monitor(m) {\n" +
      "        m.addEventListener(\"downloadprogress\", e => {\n" +
      "            console.log(`Downloaded ${e.loaded} of ${e.total} bytes.`);\n" +
      "        });\n" +
      "    },\n" +
      "});";
  }
}
