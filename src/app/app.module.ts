import {NgModule} from '@angular/core';
import {BrowserModule, provideClientHydration, withEventReplay} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {IndexComponent} from './pages/index/index.component';
import {RootComponent} from './components/root/root.component';
import {TranslatorApiComponent} from './pages/browser-ai/translator-api/translator-api.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
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
import {SummarizerApiComponent} from './components/summarizer-api/summarizer-api.component';
import {PromptApiComponent} from './pages/browser-ai/prompt-api/prompt-api.component';
import {
  DragAndDropFileSystemHandleComponent
} from './components/drag-and-drop-file-system-handle/drag-and-drop-file-system-handle.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {PromptComponent} from './components/prompt/prompt.component';
import {OutputComponent} from './components/output/output.component';
import {CardComponent} from './components/card/card.component';

@NgModule({
  declarations: [
    RootComponent,
    IndexComponent,

    CodeEditorComponent,

    WritingAssistanceApisComponent,
    WriterApiComponent,
    RewriterApiComponent,

    SummarizerApiComponent,
    PromptComponent,
    OutputComponent,

    CardComponent,
    // Pipes
    EnumToSearchSelectDropdownOptionsPipe,

    SearchSelectDropdownComponent,
    SearchSelectMultipleDropdownComponent,

    // Directives
    StepContainerVisualStatusDirective,

    StepStatusIconComponent,
    StepTitleComponent,

    // Browser AI APIs
    PromptApiComponent,
    TranslatorApiComponent,
    StepContainerVisualStatusDirective,
    ToastComponent,

    // Components
    DragAndDropFileSystemHandleComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    DragDropModule,
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
