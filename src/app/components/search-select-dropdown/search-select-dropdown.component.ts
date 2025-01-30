import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  Input,
  OnInit,
  PLATFORM_ID,
  ViewChild,
  viewChild
} from '@angular/core';
import {RouterOutlet} from "@angular/router";
import {TaskStatus} from '../../enums/task-status.enum';
import {FormControl} from '@angular/forms';
import {SearchSelectDropdownOptionsInterface} from '../../interfaces/search-select-dropdown-options.interface';
import {Subscription} from 'rxjs';
import {isPlatformServer} from '@angular/common';

@Component({
  selector: 'app-search-select-dropdown',
  templateUrl: './search-select-dropdown.component.html',
  standalone: false,
  styleUrl: './search-select-dropdown.component.scss'
})
export class SearchSelectDropdownComponent implements OnInit, AfterViewInit {
  @Input()
  control = new FormControl();

  @Input()
  options: SearchSelectDropdownOptionsInterface[] = [];

  @Input()
  name: string = ""

  @ViewChild("dropdownMenu")
  dropdownMenuElement!: ElementRef;

  filteredOptions: SearchSelectDropdownOptionsInterface[] = [];

  subscriptions: Subscription[] = [];

  dropdown: any;

  private _cursorPosition = -1;

  get cursorPosition(): number {
    return this._cursorPosition;
  }

  set cursorPosition(value: number) {
    console.log(value);
    this._cursorPosition = value;
  }

  constructor(
    @Inject(PLATFORM_ID) private readonly platformId: any,
  ) {
  }

  ngOnInit() {


    this.subscriptions.push(this.control.valueChanges.subscribe((value) => {
      this.cursorPosition = -1;

      this.filterOptions();
      this.dropdown.show();
    }));

    this.filterOptions();
  }

  ngAfterViewInit() {
    if(isPlatformServer(this.platformId)) {
      return;
    }

    // @ts-ignore
    this.dropdown = new bootstrap.Dropdown(this.dropdownMenuElement.nativeElement);
  }

  keyUp(event: any) {
    if(event.key === "ArrowUp") {
      this.moveCursorUp();
    } else if(event.key === "ArrowDown") {
      this.moveCursorDown();
    } else if(event.key === "Enter") {
      this.selectOption(this.filteredOptions[this.cursorPosition]);
    }
  }

  moveCursorUp() {
    if(this.cursorPosition <= 0) {
      this.cursorPosition = -1;
      return;
    }

    this.cursorPosition--;
  }

  moveCursorDown() {
    if(this.cursorPosition >= this.filteredOptions.length) {
      this.cursorPosition = 0;
      return;
    }

    this.cursorPosition++;
  }

  selectOption(option: SearchSelectDropdownOptionsInterface) {
    this.control.setValue(option.value);
  }

  filterOptions() {
    this.filteredOptions = this.options.filter(option => {
      return !this.control.value || (option.label.toLowerCase().includes(this.control.value) || option.value.toLowerCase().includes(this.control.value));
    })
  }

  dropdownClicked() {
    this.filteredOptions = this.options;
  }

}
