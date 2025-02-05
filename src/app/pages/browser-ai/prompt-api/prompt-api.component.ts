import {Component, EventEmitter, Inject, Input, OnInit, Output, PLATFORM_ID} from '@angular/core';
import {MediaInformationInterface} from './media-information.interface';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {AvailabilityStatusEnum} from '../../../enums/availability-status.enum';
import {BaseComponent} from '../../../components/base/base.component';
import {RequirementStatusInterface} from '../../../interfaces/requirement-status.interface';
import {RequirementStatus} from '../../../enums/requirement-status.enum';
import {DOCUMENT, isPlatformBrowser} from '@angular/common';
import {FormArray, FormControl, FormGroup} from '@angular/forms';
import {LocaleEnum} from '../../../enums/locale.enum';
import {SummarizerFormatEnum} from '../../../enums/summarizer-format.enum';
import {ActivatedRoute, Router} from '@angular/router';
import {PromptInterface} from '../../../components/prompt/prompt.interface';
import {PromptInitialRoleEnum} from '../../../enums/prompt-initial-role.enum';
import {AILanguageModelParamsInterface} from '../../../interfaces/ai-language-model-params.interface';


@Component({
  selector: 'app-prompt-api',
  templateUrl: './prompt-api.component.html',
  standalone: false,
  styleUrl: './prompt-api.component.scss'
})
export class PromptApiComponent extends BaseComponent implements OnInit {
  medias: MediaInformationInterface[] = [];

  error?: string;

  // <editor-fold desc="TopK">
  private _topK: number | null = 0;
  public topKFormControl: FormControl<number | null> = new FormControl<number | null>(0);

  get topK(): number | null {
    return this._topK;
  }

  @Input()
  set topK(value: number | null) {
    this.setTopK(value);
  }

  setTopK(value: number | null, options?: { emitFormControlEvent?: boolean, emitChangeEvent?: boolean }) {
    this._topK = value;
    this.topKFormControl.setValue(value, {emitEvent: options?.emitFormControlEvent ?? true});
    if (options?.emitChangeEvent ?? true) {
      this.topKChange.emit(value);
    }
  }

  @Output()
  topKChange = new EventEmitter<number | null>();
  // </editor-fold>

  // <editor-fold desc="Temperature">
  private _temperature: number | null = 0;
  public temperatureFormControl: FormControl<number | null> = new FormControl<number | null>(0);

  get temperature(): number | null {
    return this._temperature;
  }

  @Input()
  set temperature(value: number | null) {
    this.setTemperature(value);
  }

  setTemperature(value: number | null, options?: { emitFormControlEvent?: boolean, emitChangeEvent?: boolean }) {
    this._temperature = value;
    this.temperatureFormControl.setValue(value, {emitEvent: options?.emitFormControlEvent ?? true});
    if (options?.emitChangeEvent ?? true) {
      this.temperatureChange.emit(value);
    }
  }

  @Output()
  temperatureChange = new EventEmitter<number | null>();
  // </editor-fold>

  // <editor-fold desc="Expected Input Languages">
  private _expectedInputLanguages: LocaleEnum[] | null = [];
  public expectedInputLanguagesFormControl: FormControl<LocaleEnum[] | null> = new FormControl<LocaleEnum[] | null>([]);

  get expectedInputLanguages(): LocaleEnum[] | null {
    return this._expectedInputLanguages;
  }

  @Input()
  set expectedInputLanguages(value: LocaleEnum[] | null) {
    this.setExpectedInputLanguages(value);
  }

  setExpectedInputLanguages(value: LocaleEnum[] | null, options?: {
    emitFormControlEvent?: boolean,
    emitChangeEvent?: boolean
  }) {
    this._expectedInputLanguages = value;
    this.expectedInputLanguagesFormControl.setValue(value, {emitEvent: options?.emitFormControlEvent ?? true});
    if (options?.emitChangeEvent ?? true) {
      this.expectedInputLanguagesChange.emit(value);
    }
  }

  @Output()
  expectedInputLanguagesChange = new EventEmitter<LocaleEnum[] | null>();

  // </editor-fold>

  // <editor-fold desc="System Prompt">
  private _systemPrompt: string | null = "";
  public systemPromptFormControl: FormControl<string | null> = new FormControl<string | null>("");

  get systemPrompt(): string | null {
    return this._systemPrompt;
  }

  @Input()
  set systemPrompt(value: string | null) {
    this.setSystemPrompt(value);
  }

  setSystemPrompt(value: string | null, options?: {
    emitFormControlEvent?: boolean,
    emitChangeEvent?: boolean
  }) {
    this._systemPrompt = value;
    this.systemPromptFormControl.setValue(value, {emitEvent: options?.emitFormControlEvent ?? true});
    if (options?.emitChangeEvent ?? true) {
      this.systemPromptChange.emit(value);
    }
  }

  @Output()
  systemPromptChange = new EventEmitter<string | null>();

  // </editor-fold>

  initialPromptsFormArray = new FormArray<FormGroup<{
    prompt: FormControl<string | null>,
    role: FormControl<string | null>
  }>>([]);

  params: AILanguageModelParamsInterface | null = null;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) document: Document,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {
    super(document);
  }

  public apiFlag: RequirementStatusInterface = {
    status: RequirementStatus.Pending,
    message: 'Pending'
  }

  checkRequirements() {
    if (isPlatformBrowser(this.platformId) && this.window && !("ai" in this.window)) {
      this.apiFlag.status = RequirementStatus.Fail;
      this.apiFlag.message = "'window.ai' is not defined. Activate the flag.";
    } else if (isPlatformBrowser(this.platformId) && this.window && !("languageModel" in this.window.ai)) {
      this.apiFlag.status = RequirementStatus.Fail;
      this.apiFlag.message = "'window.ai.languageModel' is not defined. Activate the flag.";
    } else {
      this.apiFlag.status = RequirementStatus.Pass;
      this.apiFlag.message = "Passed";
    }
  }

  availabilityStatus: AvailabilityStatusEnum = AvailabilityStatusEnum.Unknown;

  get checkAvailabilityCode(): string {
    return `window.ai.languageModel.availability({
  topK: ${this.topKFormControl.value},
  temperature: ${this.temperatureFormControl.value},
  expectedInputLanguages: ${JSON.stringify(this.expectedInputLanguagesFormControl.value)},
})`
  }

  async checkAvailability() {
    try {
      this.availabilityStatus = await window.ai.languageModel.availability({
        topK: this.topKFormControl.value,
        temperature: this.temperatureFormControl.value,
        expectedInputLanguages: this.expectedInputLanguagesFormControl.value,
      })
    } catch (e: any) {
      this.availabilityStatus = AvailabilityStatusEnum.Unknown
      this.error = e;
    }
  }

  get paramsCode(): string {
    return `const params = window.ai.languageModel.params()`;
  }

  async getParams() {
    try {
      this.params = await window.ai.languageModel.params();
    } catch (e: any) {
      this.error = e;
    }
  }

  get executeCode(): string {
    return `const abortController = new AbortController();

const session = await window.ai.languageModel.create({
  topK: ${this.topKFormControl.value},
  temperature: ${this.temperatureFormControl.value},
  expectedInputLanguages: ${JSON.stringify(this.expectedInputLanguagesFormControl.value)},
  systemPrompt: ${JSON.stringify(this.systemPromptFormControl.value)},
  initialPrompts: ${JSON.stringify(this.initialPromptsFormArray.value)},
  monitor(m: any)  {
    m.addEventListener("downloadprogress", (e: any) => {
      console.log(\`Downloaded \${e.loaded * 100}%\`);
    });
  },
  signal: abortController.signal,
})`;
  }

  override ngOnInit() {
    super.ngOnInit();

    this.checkRequirements()

    this.subscriptions.push(this.topKFormControl.valueChanges.subscribe((value) => {
      this.setTopK(value, {emitChangeEvent: true, emitFormControlEvent: false});
      this.router.navigate(['.'], {
        relativeTo: this.route,
        queryParams: {topK: this.topK},
        queryParamsHandling: 'merge'
      });
    }));
    this.subscriptions.push(this.temperatureFormControl.valueChanges.subscribe((value) => {
      this.setTemperature(value, {emitChangeEvent: true, emitFormControlEvent: false});
      this.router.navigate(['.'], {
        relativeTo: this.route,
        queryParams: {temperature: this.temperature},
        queryParamsHandling: 'merge'
      });
    }));
    this.subscriptions.push(this.systemPromptFormControl.valueChanges.subscribe((value) => {
      this.setSystemPrompt(value, {emitChangeEvent: true, emitFormControlEvent: false});
      this.router.navigate(['.'], {
        relativeTo: this.route,
        queryParams: {systemPrompt: this.systemPrompt},
        queryParamsHandling: 'merge'
      });
    }));
    this.subscriptions.push(this.expectedInputLanguagesFormControl.valueChanges.subscribe((value) => {
      this.setExpectedInputLanguages(value, {emitChangeEvent: true, emitFormControlEvent: false});
      this.router.navigate(['.'], {
        relativeTo: this.route,
        queryParams: {expectedInputLanguages: this.expectedInputLanguages},
        queryParamsHandling: 'merge'
      });
    }));

    this.subscriptions.push(this.route.queryParams.subscribe((params) => {
      if (params['topK']) {
        this.setTopK(params['topK'], {emitChangeEvent: false, emitFormControlEvent: false});
      }

      if (params['temperature']) {
        this.setTemperature(params['temperature'], {emitChangeEvent: false, emitFormControlEvent: false});
      }

      if (params['systemPrompt']) {
        this.setSystemPrompt(params['systemPrompt'], {emitChangeEvent: false, emitFormControlEvent: false});
      }

      if (params['expectedInputLanguages']) {
        if (!Array.isArray(params['expectedInputLanguages'])) {
          this.setExpectedInputLanguages([params['expectedInputLanguages']], {
            emitChangeEvent: false,
            emitFormControlEvent: false
          });
        } else {
          this.setExpectedInputLanguages(params['expectedInputLanguages'], {
            emitChangeEvent: false,
            emitFormControlEvent: false
          });
        }

      }
    }));
  }

  appendInitialPrompt() {
    this.initialPromptsFormArray.push(new FormGroup({
      prompt: new FormControl<string | null>(null),
      role: new FormControl<string | null>(null),
    }));
  }

  drop(event: CdkDragDrop<any[]>) {
    // Update your data based on the drop event
    moveItemInArray(this.medias, event.previousIndex, event.currentIndex);
  }

  deleteMedia(index: number) {
    this.medias.splice(index, 1);
  }

  getImageSrc(media: MediaInformationInterface) {
    return URL.createObjectURL(media.content);
  }

  getAudioSrc(media: MediaInformationInterface) {
    return URL.createObjectURL(media.content);
  }

  onFileSystemHandlesDropped(fileSystemHandles: FileSystemHandle[]) {
    fileSystemHandles.forEach(async (fileSystemHandle) => {
      if (fileSystemHandle.kind === "directory") {
        return;
      }

      const fileSystemFileHandle = fileSystemHandle as FileSystemFileHandle;
      const file = await fileSystemFileHandle.getFile()

      if (file.type.startsWith("image")) {
        this.medias.push({
          type: 'image',
          content: file,
          filename: file.name,
          includeInPrompt: true,
          fileSystemFileHandle,
        });
      } else if (file.type.startsWith("audio")) {
        this.medias.push({
          type: 'audio',
          content: file,
          filename: file.name,
          includeInPrompt: true,
          fileSystemFileHandle,
        });
      } else {
        this.error = `Unsupported file type '${file.type}' for '${file.name}'.`;
      }
    })
  }

  protected readonly AvailabilityStatusEnum = AvailabilityStatusEnum;
  protected readonly RequirementStatus = RequirementStatus;
  protected readonly LocaleEnum = LocaleEnum;
  protected readonly SummarizerFormatEnum = SummarizerFormatEnum;
  protected readonly PromptInitialRoleEnum = PromptInitialRoleEnum;
}
