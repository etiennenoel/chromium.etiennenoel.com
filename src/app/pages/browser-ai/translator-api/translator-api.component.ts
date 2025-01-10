import {Component, OnInit} from '@angular/core';
import {FormControl} from "@angular/forms";
import {StepStatus} from "../../../enums/step-status.enum";
import {RequirementStatus} from "../../../enums/requirement-status.enum";
import {languages} from "../../../constants/languages.constants";
import {TranslatorApiVersionEnum} from "../../../enums/translator-api-version.enum";
import {CurrentApiExecutor} from "./current-api.executor";
import {ExplainerApiExecutor} from "./explainer-api.executor";
import {RequirementInterface} from "./interfaces/requirement.interface";
import {ApiExecutorInterface} from "./interfaces/api-executor.interface";
import {Step1} from "./interfaces/step-1.interface";
import {Step0} from "./interfaces/step-0.interface";

@Component({
  selector: 'app-translator-api',
  templateUrl: './translator-api.component.html',
  standalone: false,
  styleUrl: './translator-api.component.scss'
})
export class TranslatorApiComponent implements OnInit {
  apiVersion = new FormControl<TranslatorApiVersionEnum>(TranslatorApiVersionEnum.Current);

  languages = languages;
  sourceLanguage= new FormControl("en");
  targetLanguage = new FormControl('fr');

  apiExecutor!: ApiExecutorInterface;

  requirements: RequirementInterface = {
    translationApiFlag: {
        status: RequirementStatus.Checking,
      message: "Checking",
    }
  }

  steps!: {
    step0: Step0,
    step1: Step1,
  };

  protected readonly StepStatus = StepStatus;

  constructor(
      private readonly currentApiExecutor: CurrentApiExecutor,
      private readonly explainerApiExecutor: ExplainerApiExecutor,
      ) {

    this.apiExecutor = currentApiExecutor;
    this.apiVersion.setValue(TranslatorApiVersionEnum.Current);
  }


  ngOnInit() {
    this.apiVersion.valueChanges.subscribe((value) => {
        switch (value) {
          case TranslatorApiVersionEnum.Current:
            this.apiExecutor = this.currentApiExecutor;
            break;

          case TranslatorApiVersionEnum.Explainer:
            this.apiExecutor = this.explainerApiExecutor;
            break;
        }

      this.reset();
    })

    this.reset();
  }

  reset() {
    this.steps = {
      step0: {
        status: StepStatus.Idle,
        available: "",
        outputCollapsed: true,
        log: "",
      },
      step1: {
        status: StepStatus.Idle,
        totalBytes: 0,
        bytesDownloaded: 0,
        outputCollapsed: true,
        log: "",
      }
    }

    this.checkRequirements()
  }

  checkRequirements() {
    this.requirements = this.apiExecutor.checkRequirements();
  }

  async executeStep0() {
    this.steps.step0.status = StepStatus.Executing;
    this.steps.step0.outputCollapsed = false;

    if(this.sourceLanguage.value === null || this.targetLanguage.value === null) {
      return;
    }

    const response = await this.apiExecutor.executeStep0(this.sourceLanguage.value, this.targetLanguage.value);

    this.steps.step0.log = response.log;
    this.steps.step0.status = response.status
  }


  async executeStep1() {
    this.steps.step1.status = StepStatus.Executing;
    this.steps.step1.outputCollapsed = false;

    if(this.sourceLanguage.value === null || this.targetLanguage.value === null) {
      return;
    }

    const response = await this.apiExecutor.executeStep1(this.sourceLanguage.value, this.targetLanguage.value, (progress) => {
      this.steps.step1.bytesDownloaded = progress.bytesDownloaded;
      this.steps.step1.totalBytes = progress.totalBytes;
    });

    this.steps.step1.log = response.log;
    this.steps.step1.status = response.status
  }

  protected readonly RequirementStatus = RequirementStatus;
  protected readonly TranslatorApiVersionEnum = TranslatorApiVersionEnum;
}
