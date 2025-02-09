import {Component, EventEmitter, Inject, Input, OnInit, Output, PLATFORM_ID} from '@angular/core';
import {MediaInformationInterface} from './media-information.interface';
import {AvailabilityStatusEnum} from '../../../enums/availability-status.enum';
import {BaseComponent} from '../../../components/base/base.component';
import {RequirementStatusInterface} from '../../../interfaces/requirement-status.interface';
import {RequirementStatus} from '../../../enums/requirement-status.enum';
import {DOCUMENT, isPlatformBrowser} from '@angular/common';
import {FormControl} from '@angular/forms';
import {LocaleEnum} from '../../../enums/locale.enum';
import {ActivatedRoute, Router} from '@angular/router';
import {PromptInitialRoleEnum} from '../../../enums/prompt-initial-role.enum';
import {AILanguageModelParamsInterface} from '../../../interfaces/ai-language-model-params.interface';
import {TaskStatus} from '../../../enums/task-status.enum';
import {PromptTypeEnum} from '../../../enums/prompt-type.enum';
import {PromptRoleEnum} from '../../../enums/prompt-role.enum';
import {PromptInterface} from '../../../components/prompt/prompt.interface';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';


@Component({
  selector: 'app-content-api',
  templateUrl: './prompt-api.component.html',
  standalone: false,
  styleUrl: './prompt-api.component.scss'
})
export class PromptApiComponent extends BaseComponent implements OnInit {

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) document: Document,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {
    super(document);
  }

  public override ngOnInit() {
    super.ngOnInit();

    window.location.href = "https://ai.etiennenoel.com/prompt-api";
  }
}
