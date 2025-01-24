import {Component, Inject, OnDestroy, OnInit, PLATFORM_ID} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FormControl} from '@angular/forms';
import {WriterFormatEnum} from '../../../enums/writer-format.enum';
import {WriterLengthEnum} from '../../../enums/writer-length.enum';
import {WriterToneEnum} from '../../../enums/writer-tone.enum';
import {RequirementStatus} from '../../../enums/requirement-status.enum';
import {RequirementInterface} from './interfaces/requirement.interface';
import {isPlatformBrowser} from '@angular/common';
import {AvailabilityStatusEnum} from '../../../enums/availability-status.enum';
import {Subscription} from 'rxjs';
import {StepStatus} from '../../../enums/step-status.enum';

@Component({
  selector: 'app-writing-assistance-apis',
  templateUrl: './writing-assistance-apis.component.html',
  standalone: false,
  styleUrl: './writing-assistance-apis.component.scss'
})
export class WritingAssistanceApisComponent implements OnInit, OnDestroy {

  WriterToneEnum = WriterToneEnum;
  WriterFormatEnum = WriterFormatEnum;
  WriterLengthEnum = WriterLengthEnum;

  inputFormControl: FormControl<string | null> = new FormControl<string | null>("");
  sharedContextFormControl: FormControl<string | null> = new FormControl<string | null>("");

  writerToneFormControl: FormControl<WriterToneEnum | null> = new FormControl<WriterToneEnum | null>(WriterToneEnum.Neutral);

  writerFormatFormControl: FormControl<WriterFormatEnum | null> = new FormControl<WriterFormatEnum | null>(WriterFormatEnum.PlainText);

  writerLengthFormControl: FormControl<WriterLengthEnum | null> = new FormControl<WriterLengthEnum | null>(WriterLengthEnum.Medium);

  protected readonly RequirementStatus = RequirementStatus;

  public writerAvailabilityStatus: AvailabilityStatusEnum = AvailabilityStatusEnum.Unknown;
  public writerOutput = "";
  public writeStatus: StepStatus = StepStatus.Idle;

  public subscriptions: Subscription[] = [];

  requirements: RequirementInterface = {
    writerApiFlag: {
      status: RequirementStatus.Checking,
      message: "Checking",
    },
    rewriterApiFlag: {
      status: RequirementStatus.Checking,
      message: "Checking",
    },
    summarizerApiFlag: {
      status: RequirementStatus.Checking,
      message: "Checking",
    }
  }

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private readonly router: Router,
    private route: ActivatedRoute,
              ) {
  }

  checkWriterRequirements() {
    if (isPlatformBrowser(this.platformId) && !("ai" in window)) {
      this.requirements.writerApiFlag.status = RequirementStatus.Fail;
      this.requirements.writerApiFlag.message = "'window.ai' is not defined. Activate the flag.";
    }
    // @ts-ignore
    else if (isPlatformBrowser(this.platformId) && !("writer" in window.ai)) {
      this.requirements.writerApiFlag.status = RequirementStatus.Fail;
      this.requirements.writerApiFlag.message = "'window.ai.writer' is not defined. Activate the flag.";
    } else {
      this.requirements.writerApiFlag.status = RequirementStatus.Pass;
      this.requirements.writerApiFlag.message = "Passed";
    }
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

  ngOnInit() {
    this.checkWriterRequirements();
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
        this.writerToneFormControl.setValue(params['writerTone']);
      }

      if(params['writerFormat']) {
        this.writerFormatFormControl.setValue(params['writerFormat']);
      }

      if(params['writerLength']) {
        this.writerLengthFormControl.setValue(params['writerLength']);
      }
    }));

    this.subscriptions.push(this.inputFormControl.valueChanges.subscribe((value) => {
      this.router.navigate(['.'], { relativeTo: this.route, queryParams: { input: value}, queryParamsHandling: 'merge' });
    }))

    this.subscriptions.push(this.sharedContextFormControl.valueChanges.subscribe((value) => {
      this.router.navigate(['.'], { relativeTo: this.route, queryParams: { sharedContext: value}, queryParamsHandling: 'merge' });
    }))

    this.subscriptions.push(this.writerToneFormControl.valueChanges.subscribe((value) => {
      this.router.navigate(['.'], { relativeTo: this.route, queryParams: { writerTone: value}, queryParamsHandling: 'merge' });
    }))

    this.subscriptions.push(this.writerFormatFormControl.valueChanges.subscribe((value) => {
      this.router.navigate(['.'], { relativeTo: this.route, queryParams: { writerFormat: value}, queryParamsHandling: 'merge' });
    }))

    this.subscriptions.push(this.writerLengthFormControl.valueChanges.subscribe((value) => {
      this.router.navigate(['.'], { relativeTo: this.route, queryParams: { writerLength: value}, queryParamsHandling: 'merge' });
    }))
  }

  ngOnDestroy() {
    this.subscriptions.forEach(( subscription ) => {
      subscription.unsubscribe();
    });
  }

  get writerAvailableCode() {
    return `window.ai.writer.availability({
  tone: '${this.writerToneFormControl.value}',
  format: '${this.writerFormatFormControl.value}',
  length: '${this.writerLengthFormControl.value}',
})`
  }

  async writerAvailable() {
    // @ts-ignore
    this.writerAvailabilityStatus = await window.ai.writer.availability({
      tone: this.writerToneFormControl.value,
      format: this.writerFormatFormControl.value,
      length: this.writerLengthFormControl.value,
    })
  }

  get writerWriteCode() {
      return `const writer = await window.ai.writer.create({
  tone: '${this.writerToneFormControl.value}',
  format: '${this.writerFormatFormControl.value}',
  length: '${this.writerLengthFormControl.value}',
  sharedContext: '${this.sharedContextFormControl.value}',
})

await write.write('${this.inputFormControl.value}')`;
  }

  async write() {
    this.writeStatus = StepStatus.Executing;
    this.writerOutput = "Preparing and downloading model...";
    try {
      // @ts-ignore
      const writer = await window.ai.writer.create({
        tone: this.writerToneFormControl.value,
        format: this.writerFormatFormControl.value,
        length: this.writerLengthFormControl.value,
        sharedContext: this.sharedContextFormControl.value,
      });

      this.writerOutput = "Running query...";
      writer.write();

      this.writeStatus = StepStatus.Completed;
    } catch (e) {
      this.writeStatus = StepStatus.Error;
      this.writerOutput = `Error: ${e}`;
    }

  }

  protected readonly AvailabilityStatusEnum = AvailabilityStatusEnum;
  protected readonly StepStatus = StepStatus;
}
