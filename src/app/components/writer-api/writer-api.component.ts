import {Component, EventEmitter, Inject, Input, OnInit, Output, PLATFORM_ID} from '@angular/core';
import {TaskStatus} from '../../enums/task-status.enum';
import {RequirementStatus} from '../../enums/requirement-status.enum';
import {DOCUMENT, isPlatformBrowser} from '@angular/common';
import {FormControl} from '@angular/forms';
import {WriterToneEnum} from '../../enums/writer-tone.enum';
import {WriterFormatEnum} from '../../enums/writer-format.enum';
import {WriterLengthEnum} from '../../enums/writer-length.enum';
import {BaseWritingAssistanceApiComponent} from '../base-writing-assistance-api/base-writing-assistance-api.component';
import {TextUtils} from '../../utils/text.utils';
import {AvailabilityStatusEnum} from '../../enums/availability-status.enum';

@Component({
  selector: 'app-writer',
  templateUrl: './writer-api.component.html',
  standalone: false,
  styleUrl: './writer-api.component.scss'
})
export class WriterApiComponent extends BaseWritingAssistanceApiComponent implements OnInit {

  @Input()
  input: string = "";

  @Input()
  sharedContext: string = "";

  // <editor-fold desc="Tone">
  private _tone: WriterToneEnum | null = WriterToneEnum.Neutral;
  public toneFormControl: FormControl<WriterToneEnum | null> = new FormControl<WriterToneEnum | null>(WriterToneEnum.Neutral);

  get tone(): WriterToneEnum | null {
    return this._tone;
  }

  @Input()
  set tone(value: WriterToneEnum | null) {
    this._tone = value;

    this.toneFormControl.setValue(value);
    this.toneChange.emit(value);
  }

  @Output()
  toneChange = new EventEmitter<WriterToneEnum | null>();
  // </editor-fold>

  // <editor-fold desc="Format">
  private _format: WriterFormatEnum | null = WriterFormatEnum.PlainText;
  public formatFormControl: FormControl<WriterFormatEnum | null> = new FormControl<WriterFormatEnum | null>(WriterFormatEnum.PlainText);

  get format(): WriterFormatEnum | null {
    return this._format;
  }

  @Input()
  set format(value: WriterFormatEnum | null) {
    this._format = value;
    this.formatFormControl.setValue(value);
    this.formatChange.emit(value);
  }
  @Output()
  formatChange = new EventEmitter<WriterFormatEnum | null>();
  // </editor-fold>

  // <editor-fold desc="Length">
  private _length: WriterLengthEnum | null = WriterLengthEnum.Medium;
  public lengthFormControl: FormControl<WriterLengthEnum | null> = new FormControl<WriterLengthEnum | null>(WriterLengthEnum.Medium);

  get length(): WriterLengthEnum | null {
    return this._length;
  }

  @Input()
  set length(value: WriterLengthEnum | null) {
    this._length = value;
    this.lengthFormControl.setValue(value);
    this.lengthChange.emit(value);
  }
  @Output()
  lengthChange = new EventEmitter<WriterLengthEnum | null>();
  // </editor-fold>

  protected outputStatusMessage: string = "";

  @Output()
  output = new EventEmitter<string>();

  get checkAvailabilityCode() {
    return `window.ai.writer.availability({
  tone: '${this.toneFormControl.value}',
  format: '${this.formatFormControl.value}',
  length: '${this.lengthFormControl.value}',
})`
  }

  get writeCode() {
    if(this.useStreamingFormControl.value) {
      return `const writer = await window.ai.writer.create({
  tone: '${this.toneFormControl.value}',
  format: '${this.formatFormControl.value}',
  length: '${this.lengthFormControl.value}',
  sharedContext: '${this.sharedContext}',
})

const stream: ReadableStream = writer.writeStreaming('${this.input}');

for await (const chunk of stream) {
  // Do something with each 'chunk'
  this.writerOutput += chunk;
}`;
    } else {
      return `const writer = await window.ai.writer.create({
  tone: '${this.toneFormControl.value}',
  format: '${this.formatFormControl.value}',
  length: '${this.lengthFormControl.value}',
  sharedContext: '${this.sharedContext}',
})

await write.write('${this.input}')`;
    }
  }

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) document: Document,
  ) {
    super(document);
  }


  override ngOnInit() {
    super.ngOnInit();

    this.checkRequirements()

    // Register form changes events
    this.subscriptions.push(this.toneFormControl.valueChanges.subscribe((value) => {
      this.tone = value;
    }));
    this.subscriptions.push(this.formatFormControl.valueChanges.subscribe((value) => {
      this.format = value;
    }));
    this.subscriptions.push(this.lengthFormControl.valueChanges.subscribe((value) => {
      this.length = value;
    }));
  }

  checkRequirements() {
    // @ts-ignore
    if (isPlatformBrowser(this.platformId) && !("ai" in this.window)) {
      this.apiFlag.status = RequirementStatus.Fail;
      this.apiFlag.message = "'window.ai' is not defined. Activate the flag.";
    }
    // @ts-ignore
    else if (isPlatformBrowser(this.platformId) && !("writer" in this.window.ai)) {
      this.apiFlag.status = RequirementStatus.Fail;
      this.apiFlag.message = "'window.ai.writer' is not defined. Activate the flag.";
    } else {
      this.apiFlag.status = RequirementStatus.Pass;
      this.apiFlag.message = "Passed";
    }
  }

  async checkAvailability() {
    try {
      // @ts-ignore
      this.availabilityStatus = await this.window.ai.writer.availability({
        tone: this.toneFormControl.value,
        format: this.formatFormControl.value,
        length: this.lengthFormControl.value,
      })
    } catch (e) {
      this.availabilityStatus = AvailabilityStatusEnum.Unknown
    }
  }

  async write() {
    this.status = TaskStatus.Executing;
    this.outputStatusMessage = "Preparing and downloading model...";
    try {
      // @ts-ignore
      const writer = await this.window.ai.writer.create({
        tone: this.toneFormControl.value,
        format: this.formatFormControl.value,
        length: this.lengthFormControl.value,
        sharedContext: this.sharedContext,
      });

      this.startExecutionTime();

      this.outputStatusMessage = "Running query...";

      this.firstResponseNumberOfWords = 0;
      this.totalNumberOfWords = 0;
      this.responseChunks = [];

      if(this.useStreamingFormControl.value) {
        const stream: ReadableStream = writer.writeStreaming(this.input)

        let hasFirstResponse = false;

        for await (const chunk of stream) {
          if(!hasFirstResponse) {
            hasFirstResponse = true;
            this.lapFirstResponseTime();
          }

          if(this.firstResponseNumberOfWords == 0) {
            this.firstResponseNumberOfWords = TextUtils.countWords(chunk);
          }
          this.totalNumberOfWords += TextUtils.countWords(chunk);

          // Do something with each 'chunk'
          this.output += chunk;
          this.responseChunks.push(chunk);
        }

      }
      else {
        const output = await writer.write(this.input);
        this.totalNumberOfWords = TextUtils.countWords(output);

        this.output.emit(output);
      }

      this.stopExecutionTime();

      this.status = TaskStatus.Completed;
    } catch (e) {
      this.status = TaskStatus.Error;
      this.outputStatusMessage = `Error: ${e}`;
    }

  }

  WriterToneEnum = WriterToneEnum;
  WriterFormatEnum = WriterFormatEnum;
  WriterLengthEnum = WriterLengthEnum;
}
