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
import {
  SearchSelectMultipleDropdownComponent
} from './components/search-select-multiple-dropdown/search-select-multiple-dropdown.component';
import {ToastStore} from './stores/toast.store';
import {ToastComponent} from './components/toast/toast.component';
import {RewriterApiComponent} from './components/rewriter-api/rewriter-api.component';

@NgModule({
  declarations: [
    RootComponent,
    IndexComponent,

    CodeEditorComponent,

    WritingAssistanceApisComponent,
    WriterApiComponent,
    RewriterApiComponent,

    // Pipes
    EnumToSearchSelectDropdownOptionsPipe,

    SearchSelectDropdownComponent,
    SearchSelectMultipleDropdownComponent,

    // Directives
    StepContainerVisualStatusDirective,

    StepStatusIconComponent,
    StepTitleComponent,

    // Browser AI APIs
    TranslatorApiComponent,
    StepContainerVisualStatusDirective,
    ToastComponent,
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

    // Stores
    ToastStore,
  ],
  bootstrap: [RootComponent]
})
export class AppModule {
}
