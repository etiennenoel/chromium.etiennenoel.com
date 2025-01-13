import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild, viewChild} from '@angular/core';
import {RouterOutlet} from "@angular/router";
import {StepStatus} from '../../enums/step-status.enum';
import {FormControl} from '@angular/forms';
import {SearchSelectDropdownOptionsInterface} from './search-select-dropdown-options.interface';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-search-select-dropdown',
  templateUrl: './search-select-dropdown.component.html',
  standalone: false,
  styleUrl: './search-select-dropdown.component.scss'
})
export class SearchSelectDropdownComponent implements OnInit, AfterViewInit {
  @Input()
  formControl = new FormControl();

  @Input()
  options: SearchSelectDropdownOptionsInterface[] = [];

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

  ngOnInit() {


    this.subscriptions.push(this.formControl.valueChanges.subscribe((value) => {
      this.cursorPosition = -1;

      this.filterOptions();
      this.dropdown.show();
    }));

    this.filterOptions();
  }

  ngAfterViewInit() {
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
    this.formControl.setValue(option.value);
  }

  filterOptions() {
    this.filteredOptions = this.options.filter(option => {
      return !this.formControl.value || (option.text.toLowerCase().includes(this.formControl.value) || option.value.toLowerCase().includes(this.formControl.value));
    })
  }

}
