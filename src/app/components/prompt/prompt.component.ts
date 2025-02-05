import {Component, Input} from '@angular/core';
import {RouterOutlet} from "@angular/router";
import {TaskStatus} from '../../enums/task-status.enum';
import {FormControl} from '@angular/forms';
import {SearchSelectDropdownOptionsInterface} from '../../interfaces/search-select-dropdown-options.interface';

@Component({
  selector: 'app-prompt',
  templateUrl: './prompt.component.html',
  standalone: false,
  styleUrl: './prompt.component.scss'
})
export class PromptComponent {
  @Input()
  promptFormControl: FormControl<string | null> = new FormControl<string>('');

  @Input()
  roleFormControl: FormControl<string | null> = new FormControl<string>('');

  @Input()
  roles: SearchSelectDropdownOptionsInterface[] = [];
}
