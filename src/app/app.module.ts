import {NgModule} from '@angular/core';
import {BrowserModule, provideClientHydration, withEventReplay} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {IndexComponent} from './pages/index/index.component';
import {RootComponent} from './components/root/root.component';
import {TranslatorApiComponent} from './pages/browser-ai/translator-api/translator-api.component';
import {ReactiveFormsModule} from '@angular/forms';
import {ExplainerApiExecutor} from "./pages/browser-ai/translator-api/explainer-api.executor";
import {CurrentApiExecutor} from "./pages/browser-ai/translator-api/current-api.executor";
import {StepStatusIconComponent} from "./components/step-status-icon/step-status-icon.component";
import {StepTitleComponent} from "./components/step-title/step-title.component";
import {StepContainerVisualStatusDirective} from "./directives/step-container-visual-status.directive";
import {SearchSelectDropdownComponent} from './components/search-select-dropdown/search-select-dropdown.component';
import {EnumToSearchSelectDropdownOptionsPipe} from './pipes/enum-to-search-select-dropdown-options.pipe';
import {
  WritingAssistanceApisComponent
} from './pages/browser-ai/writing-assistance-apis/writing-assistance-apis.component';
import {WriterApiComponent} from './components/writer-api/writer-api.component';
import {CodeEditorComponent} from './components/code-editor/code-editor.component';

@NgModule({
  declarations: [
    RootComponent,
    IndexComponent,

    CodeEditorComponent,

    WritingAssistanceApisComponent,
    WriterApiComponent,

    // Pipes
    EnumToSearchSelectDropdownOptionsPipe,

    SearchSelectDropdownComponent,

    // Directives
    StepContainerVisualStatusDirective,

    StepStatusIconComponent,
    StepTitleComponent,

    // Browser AI APIs
    TranslatorApiComponent,
    StepContainerVisualStatusDirective,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
  ],
  providers: [
    provideClientHydration(withEventReplay()),

    // Translator API
    ExplainerApiExecutor,
    CurrentApiExecutor,
  ],
  bootstrap: [RootComponent]
})
export class AppModule {
}
