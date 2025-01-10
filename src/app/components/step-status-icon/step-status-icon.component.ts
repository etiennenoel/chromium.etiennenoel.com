import {Component, Input} from '@angular/core';
import {RouterOutlet} from "@angular/router";
import {StepStatus} from '../../enums/step-status.enum';

@Component({
  selector: 'app-step-status-icon',
  templateUrl: './step-status-icon.component.html',
  standalone: false,
  styleUrl: './step-status-icon.component.scss'
})
export class StepStatusIconComponent {
  @Input()
  status?: StepStatus;
  protected readonly StepStatus = StepStatus;
}
