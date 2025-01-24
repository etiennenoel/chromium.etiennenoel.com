import {Component, Inject, Input, OnInit, PLATFORM_ID} from '@angular/core';
import {RouterOutlet} from "@angular/router";
import {FormControl} from '@angular/forms';
import {WriterFormatEnum} from '../../../enums/writer-format.enum';
import {WriterLengthEnum} from '../../../enums/writer-length.enum';
import {WriterToneEnum} from '../../../enums/writer-tone.enum';
import {RequirementStatus} from '../../../enums/requirement-status.enum';
import {RequirementInterface} from './interfaces/requirement.interface';
import {isPlatformBrowser} from '@angular/common';

@Component({
  selector: 'app-writing-assistance-apis',
  templateUrl: './writing-assistance-apis.component.html',
  standalone: false,
  styleUrl: './writing-assistance-apis.component.scss'
})
export class WritingAssistanceApisComponent implements OnInit {

  WriterToneEnum = WriterToneEnum;
  WriterFormatEnum = WriterFormatEnum;
  WriterLengthEnum = WriterLengthEnum;

  writerToneFormControl: FormControl<WriterToneEnum | null> = new FormControl<WriterToneEnum | null>(WriterToneEnum.Neutral);

  writerFormatFormControl: FormControl<WriterFormatEnum | null> = new FormControl<WriterFormatEnum | null>(WriterFormatEnum.PlainText);

  writerLengthFormControl: FormControl<WriterLengthEnum | null> = new FormControl<WriterLengthEnum | null>(WriterLengthEnum.Medium);

  protected readonly RequirementStatus = RequirementStatus;

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

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
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
  }

}
