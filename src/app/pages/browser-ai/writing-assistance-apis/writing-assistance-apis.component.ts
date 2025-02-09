import {Component, Inject, OnDestroy, OnInit, PLATFORM_ID, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FormControl} from '@angular/forms';
import {WriterToneEnum} from '../../../enums/writer-tone.enum';
import {RequirementStatus} from '../../../enums/requirement-status.enum';
import {RequirementInterface} from './interfaces/requirement.interface';
import {DOCUMENT, isPlatformBrowser} from '@angular/common';
import {TaskStatus} from '../../../enums/task-status.enum';
import {BaseComponent} from '../../../components/base/base.component';
import {WriterLengthEnum} from '../../../enums/writer-length.enum';
import {WriterFormatEnum} from '../../../enums/writer-format.enum';
import {LocaleEnum} from '../../../enums/locale.enum';
import {ExecutionPerformanceResultInterface} from '../../../interfaces/execution-performance-result.interface';
import {ToastStore} from '../../../stores/toast.store';
import {ActiveTabEnum} from './active-tab.enum';


@Component({
  selector: 'app-writing-assistance-apis',
  templateUrl: './writing-assistance-apis.component.html',
  standalone: false,
  styleUrl: './writing-assistance-apis.component.scss'
})
export class WritingAssistanceApisComponent extends BaseComponent implements OnInit, OnDestroy {

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) document: Document,
    private readonly router: Router,
    private route: ActivatedRoute,
    private readonly toastStore: ToastStore,
              ) {
    super(document);
  }



  override ngOnInit() {
    super.ngOnInit();

    window.location.href = "https://ai.etiennenoel.com/writing-assistance-apis";
  }

}
