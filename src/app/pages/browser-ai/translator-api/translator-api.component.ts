import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl} from "@angular/forms";
import {TaskStatus} from "../../../enums/task-status.enum";
import {RequirementStatus} from "../../../enums/requirement-status.enum";
import {languages} from "../../../constants/languages.constants";
import {TranslatorApiVersionEnum} from "../../../enums/translator-api-version.enum";
import {CurrentApiExecutor} from "./current-api.executor";
import {ExplainerApiExecutor} from "./explainer-api.executor";
import {RequirementInterface} from "./interfaces/requirement.interface";
import {ApiExecutorInterface} from "./interfaces/api-executor.interface";
import {Step1} from "./interfaces/step-1.interface";
import {Step0} from "./interfaces/step-0.interface";
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {Step2} from './interfaces/step-2.interface';
import {
  SearchSelectDropdownOptionsInterface
} from '../../../interfaces/search-select-dropdown-options.interface';

@Component({
  selector: 'app-translator-api',
  templateUrl: './translator-api.component.html',
  standalone: false,
  styleUrl: './translator-api.component.scss'
})
export class TranslatorApiComponent implements OnInit, OnDestroy {


  constructor(
      private readonly currentApiExecutor: CurrentApiExecutor,
      private readonly explainerApiExecutor: ExplainerApiExecutor,
      private readonly router: Router,
      private route: ActivatedRoute,
      ) {
  }


  ngOnInit() {
    window.location.href = "https://ai.etiennenoel.com/translator-api";
  }

  ngOnDestroy() {

  }

}
