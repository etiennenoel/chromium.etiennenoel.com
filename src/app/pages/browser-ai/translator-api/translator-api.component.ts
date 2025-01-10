import {Component, OnInit} from '@angular/core';
import {FormControl} from "@angular/forms";

enum StepStatus {
    Idle = 'IDLE',
    Executing = 'EXECUTING',
    Completed = 'COMPLETED',
    Error = 'ERROR',
}

enum RequirementStatus {
  Checking = 'CHECKING',
  Fail = 'FAIL',
  Pass = 'PASS',
}

interface Step1 {
  status: StepStatus,
  totalBytes: number;
  bytesDownloaded: number;
  outputCollapsed: boolean
  log: string;
}


@Component({
  selector: 'app-translator-api',
  templateUrl: './translator-api.component.html',
  standalone: false,
  styleUrl: './translator-api.component.scss'
})
export class TranslatorApiComponent implements OnInit {
  languages: {locale: string, title: string}[] = [
    {locale:"en", title: "English"},
      {locale:"fr", title: "French"},
      {locale: "de", title: "German"},
      {locale: "it", title: "Italian"},
      {locale: "es", title: "Spanish"},
      {locale: "pt", title: "Portuguese"},
      {locale: "nl", title: "Dutch"},
      {locale: "ru", title: "Russian"},
      {locale: "ja", title: "Japanese"},
  ]

  sourceLanguage= new FormControl("en");

  targetLanguage = new FormControl('fr');

  requirements: {
    translationApiFlag: {
      status: RequirementStatus,
      message: string;
    }
  } = {
    translationApiFlag: {
        status: RequirementStatus.Checking,
      message: "Checking",
    }
  }

  steps: {
    step1: Step1,
  } = {
    step1: {
        status: StepStatus.Idle,
        totalBytes: 0,
        bytesDownloaded: 0,
        outputCollapsed: true,
        log: "",
    }
  };
  protected readonly StepStatus = StepStatus;

  ngOnInit() {
    this.checkRequirements();
  }

  async checkRequirements() {
    // Check if the translation API flag is enabled
    if(!window.hasOwnProperty('ai')) {
        this.requirements.translationApiFlag.status = RequirementStatus.Fail;
        this.requirements.translationApiFlag.message = "'window.ai' is not defined. Activate the flag.";
    } else {
        this.requirements.translationApiFlag.status = RequirementStatus.Pass;
        this.requirements.translationApiFlag.message = "Passed";
    }
  }

  async executeStep1() {
    this.steps.step1.status = StepStatus.Executing;
    this.steps.step1.outputCollapsed = false;

    try {
      // @ts-ignore
      const translator = await ai.translator.create({
        sourceLanguage: this.sourceLanguage,
        targetLanguage: this.targetLanguage,
        monitor(m: any) {
          m.addEventListener("downloadprogress", (e: any) => {
            this.steps.step1.bytesDownloaded = e.loaded;
            this.steps.step1.totalBytes = e.total;
          });
        },
      });
    } catch (e: any) {
        this.steps.step1.log = `There was an error executing the command. Error: ${e.message}`;
        this.steps.step1.status = StepStatus.Error;
    }

  }

  protected readonly RequirementStatus = RequirementStatus;
}
