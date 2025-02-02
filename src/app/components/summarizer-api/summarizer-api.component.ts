import {Component, EventEmitter, Inject, Input, OnInit, Output, PLATFORM_ID} from '@angular/core';
import {TaskStatus} from '../../enums/task-status.enum';
import {RequirementStatus} from '../../enums/requirement-status.enum';
import {DOCUMENT, isPlatformBrowser} from '@angular/common';
import {FormControl} from '@angular/forms';
import {BaseWritingAssistanceApiComponent} from '../base-writing-assistance-api/base-writing-assistance-api.component';
import {TextUtils} from '../../utils/text.utils';
import {AvailabilityStatusEnum} from '../../enums/availability-status.enum';
import {SearchSelectDropdownOptionsInterface} from '../../interfaces/search-select-dropdown-options.interface';
import {LocaleEnum} from '../../enums/locale.enum';
import {SummarizerTypeEnum} from '../../enums/summarizer-type.enum';
import {SummarizerFormatEnum} from '../../enums/summarizer-format.enum';
import {SummarizerLengthEnum} from '../../enums/summarizer-length.enum';


@Component({
  selector: 'app-summarizer',
  templateUrl: './summarizer-api.component.html',
  standalone: false,
  styleUrl: './summarizer-api.component.scss'
})
export class SummarizerApiComponent extends BaseWritingAssistanceApiComponent implements OnInit {

  @Input()
  input: string = "";

  @Input()
  sharedContext: string = "";

  // <editor-fold desc="Type">
  private _type: SummarizerTypeEnum | null = SummarizerTypeEnum.Headline;
  public typeFormControl: FormControl<SummarizerTypeEnum | null> = new FormControl<SummarizerTypeEnum | null>(SummarizerTypeEnum.Headline);

  get type(): SummarizerTypeEnum | null {
    return this._type;
  }

  @Input()
  set type(value: SummarizerTypeEnum | null) {
   this.setType(value);
  }

  setType(value: SummarizerTypeEnum | null, options?: {emitFormControlEvent?: boolean, emitChangeEvent?: boolean}) {
    this._type = value;
    this.typeFormControl.setValue(value, {emitEvent: options?.emitFormControlEvent ?? true});
    if(options?.emitChangeEvent ?? true) {
      this.typeChange.emit(value);
    }
  }

  @Output()
  typeChange = new EventEmitter<SummarizerTypeEnum | null>();
  // </editor-fold>

  // <editor-fold desc="Context">
  private _context: string | null = "";
  public contextFormControl = new FormControl<string | null>("");

  get context(): string | null {
    return this._context;
  }

  @Input()
  set context(value: string | null) {
   this.setContext(value);
  }

  setContext(value: string | null, options?: {emitFormControlEvent?: boolean, emitChangeEvent?: boolean}) {
    this._context = value;
    this.contextFormControl.setValue(value, {emitEvent: options?.emitFormControlEvent ?? true});
    if(options?.emitChangeEvent ?? true) {
      this.contextChange.emit(value);
    }
  }

  @Output()
  contextChange = new EventEmitter<string | null>();
  // </editor-fold>

  // <editor-fold desc="Format">
  private _format: SummarizerFormatEnum | null = SummarizerFormatEnum.PlainText;
  public formatFormControl: FormControl<SummarizerFormatEnum | null> = new FormControl<SummarizerFormatEnum | null>(SummarizerFormatEnum.PlainText);

  get format(): SummarizerFormatEnum | null {
    return this._format;
  }

  @Input()
  set format(value: SummarizerFormatEnum | null) {
    this.setFormat(value);
  }

  setFormat(value: SummarizerFormatEnum | null, options?: {emitFormControlEvent?: boolean, emitChangeEvent?: boolean}) {
    this._format = value;
    this.formatFormControl.setValue(value, {emitEvent: options?.emitFormControlEvent ?? true});
    if(options?.emitChangeEvent ?? true) {
      this.formatChange.emit(value);
    }
  }

  @Output()
  formatChange = new EventEmitter<SummarizerFormatEnum | null>();
  // </editor-fold>

  // <editor-fold desc="Length">
  private _length: SummarizerLengthEnum | null = SummarizerLengthEnum.Medium;
  public lengthFormControl: FormControl<SummarizerLengthEnum | null> = new FormControl<SummarizerLengthEnum | null>(SummarizerLengthEnum.Medium);

  get length(): SummarizerLengthEnum | null {
    return this._length;
  }

  @Input()
  set length(value: SummarizerLengthEnum | null) {
    this.setLength(value);
  }

  setLength(value: SummarizerLengthEnum | null, options?: {emitFormControlEvent?: boolean, emitChangeEvent?: boolean}) {
    this._length = value;
    this.lengthFormControl.setValue(value, {emitEvent: options?.emitFormControlEvent ?? true});
    if(options?.emitChangeEvent ?? true) {
      this.lengthChange.emit(value);
    }
  }

  @Output()
  lengthChange = new EventEmitter<SummarizerLengthEnum | null>();
  // </editor-fold>

  protected outputStatusMessage: string = "";

  get checkAvailabilityCode() {
    return `window.ai.summarizer.availability({
  type: '${this.typeFormControl.value}',
  format: '${this.formatFormControl.value}',
  length: '${this.lengthFormControl.value}',
  expectedInputLanguages: ${JSON.stringify(this.expectedInputLanguagesFormControl.value)},
  expectedContextLanguages: ${JSON.stringify(this.expectedContextLanguagesFormControl.value)},
  outputLanguage: '${this.outputLanguageFormControl.value}',
})`
  }

  get summarizeCode() {
    if(this.useStreamingFormControl.value) {
      return `const abortController = new AbortController();

const summarizer = await window.ai.summarizer.create({
  type: '${this.typeFormControl.value}',
  format: '${this.formatFormControl.value}',
  length: '${this.lengthFormControl.value}',
  sharedContext: '${this.sharedContext}',
  expectedInputLanguages: ${JSON.stringify(this.expectedInputLanguagesFormControl.value)},
  expectedContextLanguages: ${JSON.stringify(this.expectedContextLanguagesFormControl.value)},
  outputLanguage: '${this.outputLanguageFormControl.value}',
  monitor(m: any)  {
    m.addEventListener("downloadprogress", (e: any) => {
      console.log(\`Downloaded \${e.loaded * 100}%\`);
    });
  },
  signal: abortController.signal,
})

const stream: ReadableStream = summarizer.summarizeStreaming('${this.input}', {context: '${this.contextFormControl.value}'});

for await (const chunk of stream) {
  // Do something with each 'chunk'
  this.summarizerOutput += chunk;
}`;
    } else {
      return `const abortController = new AbortController();

const summarizer = await window.ai.summarizer.create({
  type: '${this.typeFormControl.value}',
  format: '${this.formatFormControl.value}',
  length: '${this.lengthFormControl.value}',
  sharedContext: '${this.sharedContext}',
  expectedInputLanguages: ${JSON.stringify(this.expectedInputLanguagesFormControl.value)},
  expectedContextLanguages: ${JSON.stringify(this.expectedContextLanguagesFormControl.value)},
  outputLanguage: '${this.outputLanguageFormControl.value}',
  monitor(m: any)  {
    m.addEventListener("downloadprogress", (e: any) => {
      console.log(\`Downloaded \${e.loaded * 100}%\`);
    });
  },
  signal: abortController.signal,
})

await summarizer.summarize('${this.input}', {context: '${this.contextFormControl.value}'})`;
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
    this.subscriptions.push(this.typeFormControl.valueChanges.subscribe((value) => {
      this.setType(value, {emitChangeEvent: true, emitFormControlEvent: false});
    }));
    this.subscriptions.push(this.formatFormControl.valueChanges.subscribe((value) => {
      this.setFormat(value, {emitChangeEvent: true, emitFormControlEvent: false});
    }));
    this.subscriptions.push(this.lengthFormControl.valueChanges.subscribe((value) => {
      this.setLength(value);
    }));
    this.subscriptions.push(this.expectedInputLanguagesFormControl.valueChanges.subscribe((value) => {
      this.setExpectedInputLanguages(value, {emitChangeEvent: true, emitFormControlEvent: false});
    }));
    this.subscriptions.push(this.expectedContextLanguagesFormControl.valueChanges.subscribe((value) => {
      this.setExpectedContextLanguages(value, {emitChangeEvent: true, emitFormControlEvent: false});
    }));
    this.subscriptions.push(this.outputLanguageFormControl.valueChanges.subscribe((value) => {
      this.setOutputLanguage(value, {emitChangeEvent: true, emitFormControlEvent: false});
    }));

    this.subscriptions.push(this.contextFormControl.valueChanges.subscribe((value) => {
      this.setContext(value, {emitChangeEvent: true, emitFormControlEvent: false});
    }));

  }

  checkRequirements() {
    // @ts-ignore
    if (isPlatformBrowser(this.platformId) && !("ai" in this.window)) {
      this.apiFlag.status = RequirementStatus.Fail;
      this.apiFlag.message = "'window.ai' is not defined. Activate the flag.";
    }
    // @ts-ignore
    else if (isPlatformBrowser(this.platformId) && !("summarizer" in this.window.ai)) {
      this.apiFlag.status = RequirementStatus.Fail;
      this.apiFlag.message = "'window.ai.summarizer' is not defined. Activate the flag.";
    } else {
      this.apiFlag.status = RequirementStatus.Pass;
      this.apiFlag.message = "Passed";
    }
  }

  async checkAvailability() {
    try {
      // @ts-ignore
      this.availabilityStatus = await this.window.ai.summarizer.availability({
        type: this.typeFormControl.value,
        format: this.formatFormControl.value,
        length: this.lengthFormControl.value,
        expectedInputLanguages: this.expectedInputLanguagesFormControl.value,
        expectedContextLanguages: this.expectedContextLanguagesFormControl.value,
        outputLanguage: this.outputLanguageFormControl.value
      })
    } catch (e: any) {
      this.availabilityStatus = AvailabilityStatusEnum.Unknown
      this.errorChange.emit(e);
    }
  }

  async summarize() {
    this.status = TaskStatus.Executing;
    this.outputStatusMessage = "Preparing and downloading model...";
    this.outputChunks = [];
    this.outputChunksChange.emit(this.outputChunks);
    this.output = "";
    this.outputStatusMessage = "Running query...";
    this.loaded = 0;

    try {
      this.abortControllerFromCreate  = new AbortController();
      this.abortController = new AbortController();

      // @ts-ignore
      const summarizer = await this.window.ai.summarizer.create({
        type: this.typeFormControl.value,
        format: this.formatFormControl.value,
        length: this.lengthFormControl.value,
        sharedContext: this.sharedContext,
        expectedInputLanguages: this.expectedInputLanguagesFormControl.value,
        expectedContextLanguages: this.expectedContextLanguagesFormControl.value,
        outputLanguage: this.outputLanguageFormControl.value,
        monitor(m: any)  {
          m.addEventListener("downloadprogress", (e: any) => {
            console.log(`Downloaded ${e.loaded * 100}%`);
            this.loaded = e.loaded;
          });
        },
        signal: this.abortControllerFromCreate.signal,
      });

      this.startExecutionTime();

      this.executionPerformance.firstResponseNumberOfWords = 0;
      this.executionPerformance.totalNumberOfWords = 0;
      this.emitExecutionPerformanceChange();

      if(this.useStreamingFormControl.value) {
        const stream: ReadableStream = summarizer.summarizeStreaming(this.input, {context: this.contextFormControl.value, signal: this.abortController.signal});

        let hasFirstResponse = false;

        for await (const chunk of stream) {
          if(!hasFirstResponse) {
            hasFirstResponse = true;
            this.lapFirstResponseTime();
          }

          if(this.executionPerformance.firstResponseNumberOfWords == 0) {
            this.executionPerformance.firstResponseNumberOfWords = TextUtils.countWords(chunk);
          }
          this.executionPerformance.totalNumberOfWords += TextUtils.countWords(chunk);

          this.emitExecutionPerformanceChange();

          // Do something with each 'chunk'
          this.output += chunk;
          this.outputChunks.push(chunk);
          this.outputChunksChange.emit(this.outputChunks);
        }

      }
      else {
        const output = await summarizer.summarize(this.input, {context: this.contextFormControl.value, signal: this.abortController.signal});
        this.executionPerformance.totalNumberOfWords = TextUtils.countWords(output);
        this.emitExecutionPerformanceChange();

        this.output = output;
      }

      this.status = TaskStatus.Completed;
    } catch (e: any) {
      this.status = TaskStatus.Error;
      this.outputStatusMessage = `Error: ${e}`;
      this.errorChange.emit(e);
    } finally {
      this.stopExecutionTime();
    }

  }

  SummarizerTypeEnum = SummarizerTypeEnum;
  SummarizerFormatEnum = SummarizerFormatEnum;
  SummarizerLengthEnum = SummarizerLengthEnum;
  protected readonly LocaleEnum = LocaleEnum;
}
