import {Component, EventEmitter, Inject, Input, OnInit, Output, PLATFORM_ID} from '@angular/core';
import {DOCUMENT, isPlatformBrowser} from '@angular/common';
import {RequirementStatus} from '../../../enums/requirement-status.enum';
import {BaseComponent} from '../../../components/base/base.component';
import {RequirementStatusInterface} from '../../../interfaces/requirement-status.interface';
import {AvailabilityStatusEnum} from '../../../enums/availability-status.enum';
import {LocaleEnum} from '../../../enums/locale.enum';
import {FormControl} from '@angular/forms';
import {TaskStatus} from '../../../enums/task-status.enum';
import {ActivatedRoute, Router} from '@angular/router';


@Component({
  selector: 'app-language-detector',
  templateUrl: './language-detector.component.html',
  standalone: false,
  styleUrl: './language-detector.component.scss'
})
export class LanguageDetectorComponent extends BaseComponent implements OnInit {

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) document: Document,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {
    super(document);
  }

  override ngOnInit() {
    super.ngOnInit();

    window.location.href = "https://ai.etiennenoel.com/language-detector-api";
  }
}
