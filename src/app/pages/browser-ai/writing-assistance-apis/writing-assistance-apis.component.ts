import {Component, Inject, OnDestroy, OnInit, PLATFORM_ID} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FormControl} from '@angular/forms';
import {WriterToneEnum} from '../../../enums/writer-tone.enum';
import {RequirementStatus} from '../../../enums/requirement-status.enum';
import {RequirementInterface} from './interfaces/requirement.interface';
import {DOCUMENT, isPlatformBrowser} from '@angular/common';
import {AvailabilityStatusEnum} from '../../../enums/availability-status.enum';
import {TaskStatus} from '../../../enums/task-status.enum';
import {BaseComponent} from '../../../components/base/base.component';
import {TextUtils} from '../../../utils/text.utils';
import {WriterLengthEnum} from '../../../enums/writer-length.enum';
import {WriterFormatEnum} from '../../../enums/writer-format.enum';
import {LocaleEnum} from '../../../enums/locale.enum';


@Component({
  selector: 'app-writing-assistance-apis',
  templateUrl: './writing-assistance-apis.component.html',
  standalone: false,
  styleUrl: './writing-assistance-apis.component.scss'
})
export class WritingAssistanceApisComponent extends BaseComponent implements OnInit, OnDestroy {

  inputFormControl: FormControl<string | null> = new FormControl<string | null>("");
  sharedContextFormControl: FormControl<string | null> = new FormControl<string | null>("");

  protected readonly RequirementStatus = RequirementStatus;

  activeTab: number = 0;

  writerTone: WriterToneEnum = WriterToneEnum.Neutral;
  writerFormat: WriterFormatEnum = WriterFormatEnum.PlainText;
  writerLength: WriterLengthEnum = WriterLengthEnum.Medium;
  writerUseStreaming: boolean = false;
  writerExpectedInputLanguages: LocaleEnum[] = [];
  writerExpectedContextLanguages: LocaleEnum[] = [];
  writerOutputLanguage: LocaleEnum = LocaleEnum.en;

  requirements: RequirementInterface = {
    writerApiFlag: {
      status: RequirementStatus.Pending,
      message: "Checking",
    },
    rewriterApiFlag: {
      status: RequirementStatus.Pending,
      message: "Checking",
    },
    summarizerApiFlag: {
      status: RequirementStatus.Pending,
      message: "Checking",
    }
  }

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) document: Document,
    private readonly router: Router,
    private route: ActivatedRoute,
              ) {
    super(document);
  }


  checkRewriterRequirements() {
    if (isPlatformBrowser(this.platformId) && !("ai" in window)) {
      this.requirements.rewriterApiFlag.status = RequirementStatus.Fail;
      this.requirements.rewriterApiFlag.message = "'window.ai' is not defined. Activate the flag.";
    }
    // @ts-ignore
    else if (isPlatformBrowser(this.platformId) && !("rewriter" in window.ai)) {
      this.requirements.rewriterApiFlag.status = RequirementStatus.Fail;
      this.requirements.rewriterApiFlag.message = "'window.ai.rewriter' is not defined. Activate the flag.";
    } else {
      this.requirements.rewriterApiFlag.status = RequirementStatus.Pass;
      this.requirements.rewriterApiFlag.message = "Passed";
    }
  }


  checkSummarizerRequirements() {
    if (isPlatformBrowser(this.platformId) && !("ai" in window)) {
      this.requirements.summarizerApiFlag.status = RequirementStatus.Fail;
      this.requirements.summarizerApiFlag.message = "'window.ai' is not defined. Activate the flag.";
    }
    // @ts-ignore
    else if (isPlatformBrowser(this.platformId) && !("summarizer" in window.ai)) {
      this.requirements.summarizerApiFlag.status = RequirementStatus.Fail;
      this.requirements.summarizerApiFlag.message = "'window.ai.summarizer' is not defined. Activate the flag.";
    } else {
      this.requirements.summarizerApiFlag.status = RequirementStatus.Pass;
      this.requirements.summarizerApiFlag.message = "Passed";
    }
  }

  override ngOnInit() {
    super.ngOnInit();

    this.checkRewriterRequirements();
    this.checkSummarizerRequirements();

    this.subscriptions.push(this.route.queryParams.subscribe((params) => {
      if(params['input']) {
        this.inputFormControl.setValue(params['input']);
      }

      if(params['sharedContext']) {
        this.sharedContextFormControl.setValue(params['sharedContext']);
      }

      if(params['writerTone']) {
        this.writerTone = params['writerTone'];
      }

      if(params['writerFormat']) {
        this.writerFormat = params['writerFormat'];
      }

      if(params['writerLength']) {
        this.writerLength = params['writerLength'];
      }

      if(params['writerUseStreaming']) {
        this.writerUseStreaming = params['writerUseStreaming'];
      }

      if(params['writerExpectedInputLanguages']) {
        if(!Array.isArray(params['writerExpectedInputLanguages'])) {
          this.writerExpectedInputLanguages = [params['writerExpectedInputLanguages']];
        } else {
          this.writerExpectedInputLanguages = params['writerExpectedInputLanguages'];
        }

      }
      if(params['writerExpectedContextLanguages']) {
        if(!Array.isArray(params['writerExpectedContextLanguages'])) {
          this.writerExpectedContextLanguages = [params['writerExpectedContextLanguages']];
        } else {
          this.writerExpectedContextLanguages = params['writerExpectedContextLanguages'];
        }
      }

      if(params['writerOutputLanguage']) {
        this.writerOutputLanguage = params['writerOutputLanguage'];
      }
    }));

    this.subscriptions.push(this.inputFormControl.valueChanges.subscribe((value) => {
      this.router.navigate(['.'], { relativeTo: this.route, queryParams: { input: value}, queryParamsHandling: 'merge' });
    }))

    this.subscriptions.push(this.sharedContextFormControl.valueChanges.subscribe((value) => {
      this.router.navigate(['.'], { relativeTo: this.route, queryParams: { sharedContext: value}, queryParamsHandling: 'merge' });
    }))
  }


  writerToneChange() {
    this.router.navigate(['.'], { relativeTo: this.route, queryParams: { writerTone: this.writerTone}, queryParamsHandling: 'merge' });
  }

  writerFormatChange() {
    this.router.navigate(['.'], { relativeTo: this.route, queryParams: { writerFormat: this.writerFormat}, queryParamsHandling: 'merge' });
  }

  writerLengthChange() {
    this.router.navigate(['.'], { relativeTo: this.route, queryParams: { writerLength: this.writerLength}, queryParamsHandling: 'merge' });
  }

  writerUseStreamingChange() {
    this.router.navigate(['.'], { relativeTo: this.route, queryParams: { writerUseStreaming: this.writerUseStreaming}, queryParamsHandling: 'merge' });
  }

  writerExpectedInputLanguagesChange() {
    this.router.navigate(['.'], { relativeTo: this.route, queryParams: { writerExpectedInputLanguages: this.writerExpectedInputLanguages}, queryParamsHandling: 'merge' });
  }

  writerExpectedContextLanguagesChange() {
    this.router.navigate(['.'], { relativeTo: this.route, queryParams: { writerExpectedContextLanguages: this.writerExpectedContextLanguages}, queryParamsHandling: 'merge' });
  }

  writerOutputLanguageChange() {
    this.router.navigate(['.'], { relativeTo: this.route, queryParams: { writerOutputLanguage: this.writerOutputLanguage}, queryParamsHandling: 'merge' });
  }

}
