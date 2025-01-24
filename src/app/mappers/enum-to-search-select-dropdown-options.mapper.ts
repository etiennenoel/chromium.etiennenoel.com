import {
  SearchSelectDropdownOptionsInterface
} from '../components/search-select-dropdown/search-select-dropdown-options.interface';

export class EnumToSearchSelectDropdownOptionsMapper {
  static map(enumType: any): SearchSelectDropdownOptionsInterface[] {
    return Object.entries(enumType).map(([key, value]) => ({
      label: key,
      value: value
    } as SearchSelectDropdownOptionsInterface));
  }
}
