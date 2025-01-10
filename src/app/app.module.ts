import {NgModule} from '@angular/core';
import {BrowserModule, provideClientHydration, withEventReplay} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {IndexComponent} from './pages/index/index.component';
import {RootComponent} from './components/root/root.component';
import {TranslatorApiComponent} from './pages/browser-ai/translator-api/translator-api.component';
import {ReactiveFormsModule} from '@angular/forms';
import {ExplainerApiExecutor} from "./pages/browser-ai/translator-api/explainer-api.executor";
import {CurrentApiExecutor} from "./pages/browser-ai/translator-api/current-api.executor";

@NgModule({
    declarations: [
        RootComponent,
        IndexComponent,

        // Browser AI APIs
        TranslatorApiComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        ReactiveFormsModule
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
