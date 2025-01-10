import {Directive, HostBinding, Input} from '@angular/core';
import {StepStatus} from '../enums/step-status.enum';

@Directive({
  selector: '[stepVisualStatus]',
  standalone: false,
})
export class StepContainerVisualStatusDirective {

  @Input()
  public status?: StepStatus

  @HostBinding('style.borderLeftWidth')
  get border() {
    return `5px !important`;
  }

  @HostBinding('class')
  get getClass() {
    let classes = "border-start";

    switch (this.status) {
      case StepStatus.Idle:
        classes += " border-dark-subtle"
        break;
      case StepStatus.Executing:
        classes += " border-primary"
        break;
      case StepStatus.Error:
        classes += " border-danger"
        break;
      case StepStatus.Completed:
        classes += " border-success"
        break;
    }

    return classes;
  }
}
