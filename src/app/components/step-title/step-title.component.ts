import {Component, Input} from '@angular/core';
import {RouterOutlet} from "@angular/router";
import {StepStatus} from '../../enums/step-status.enum';

@Component({
  selector: 'app-step-title',
  templateUrl: './step-title.component.html',
  standalone: false,
  styleUrl: './step-title.component.scss'
})
export class StepTitleComponent {
  @Input()
  status?: StepStatus;

  @Input()
  title?: string;

  protected readonly StepStatus = StepStatus;
}
