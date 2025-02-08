import {Component, Inject, Input, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, NavigationStart, Router, RouterOutlet} from "@angular/router";
import {BaseComponent} from '../../../components/base/base.component';
import {DOCUMENT} from '@angular/common';

@Component({
  selector: 'app-browser-ai-index',
  templateUrl: './browser-ai-index.component.html',
  standalone: false,
  styleUrl: './browser-ai-index.component.scss'
})
export class BrowserAIIndexComponent extends BaseComponent implements OnInit {

  public currentRoute?: 'translator-api' | 'language-detector-api' | 'writing-assistance-apis' | 'prompt-api';

  constructor(
    @Inject(DOCUMENT) document: Document,
    protected readonly route: ActivatedRoute,
    protected readonly router: Router,
  ) {
    super(document);
  }

  override ngOnInit() {
    super.ngOnInit();

    this.setCurrentRoute(window.location.pathname);

    this.subscriptions.push(this.router.events.subscribe((event) => {
      if(event instanceof NavigationEnd) {
        this.setCurrentRoute(event.url);
      }
    }))
  }

  setCurrentRoute(url: string) {
    if(url.endsWith('translator-api')) {
      this.currentRoute = 'translator-api';
    } else if(url.endsWith('language-detector-api')) {
      this.currentRoute = 'language-detector-api';
    } else if(url.endsWith('writing-assistance-apis')) {
      this.currentRoute = 'writing-assistance-apis';
    } else if(url.endsWith('prompt-api')) {
      this.currentRoute = 'prompt-api';
    }
  }

}
