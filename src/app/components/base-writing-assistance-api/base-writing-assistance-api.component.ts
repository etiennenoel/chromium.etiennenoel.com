import {Component, Directive, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {RouterOutlet} from "@angular/router";
import {TaskStatus} from '../../enums/task-status.enum';
import {Subscription} from 'rxjs';
import {BaseComponent} from '../base/base.component';
import {AvailabilityStatusEnum} from '../../enums/availability-status.enum';
import {RequirementStatusInterface} from '../../interfaces/requirement-status.interface';
import {RequirementStatus} from '../../enums/requirement-status.enum';
import {FormControl} from '@angular/forms';

declare global {
  interface Window { ai: any; }
}


@Directive()
export abstract class BaseWritingAssistanceApiComponent extends BaseComponent {
  public availabilityStatus: AvailabilityStatusEnum = AvailabilityStatusEnum.Unknown;


  private _useStreaming: boolean | null = false;
  public useStreamingFormControl = new FormControl<boolean>(false);
  @Output()
  useStreamingChange = new EventEmitter<boolean | null>();

  get useStreaming(): boolean | null {
    return this._useStreaming;
  }

  @Input()
  set useStreaming(value: boolean | null) {
    this._useStreaming = value;
    this.useStreamingFormControl.setValue(value);
    this.useStreamingChange.emit(value);
  }

  public status: TaskStatus = TaskStatus.Idle;

  public apiFlag: RequirementStatusInterface = {
    status: RequirementStatus.Pending,
    message: 'Pending'
  }

  private executionTimeInterval: any;
  public startedExecutionAt = 0
  public firstResponseIn = 0
  public elapsedTime = 0;
  public totalExecutionTime = 0
  public firstResponseNumberOfWords = 0
  public totalNumberOfWords = 0;

  public responseChunks: string[] = [];

  startExecutionTime() {
    this.stopExecutionTime()

    this.firstResponseIn = 0;
    this.elapsedTime = 0;
    this.startedExecutionAt = performance.now();
    this.totalExecutionTime = 0;

    this.executionTimeInterval = setInterval(() => {
      this.elapsedTime = Math.round(performance.now() - this.startedExecutionAt);
    }, 50);
  }

  lapFirstResponseTime() {
    this.firstResponseIn = Math.round(performance.now() - this.startedExecutionAt);
  }

  stopExecutionTime() {
    clearInterval(this.executionTimeInterval);
  }


  public readonly RequirementStatus = RequirementStatus;
  public  readonly AvailabilityStatusEnum = AvailabilityStatusEnum;
}
