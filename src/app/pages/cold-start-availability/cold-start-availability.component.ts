import {Component, Inject, OnDestroy, OnInit, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';

export type ProbeBadgeStatus = 'WAITING' | 'PENDING' | 'RESOLVED' | 'HUNG' | 'REJECTED' | 'UNEXPOSED';

export type VerdictState = 'running' | 'pass' | 'fail';

export interface BuiltInAiApiDefinition {
  id: string;
  label: string;
  targetOfBug: boolean;
  call: () => Promise<string> | null;
}

export interface AvailabilityProbeRecord {
  api: BuiltInAiApiDefinition;
  status: ProbeBadgeStatus;
  startTime: number;
  settled: boolean;
  missing: boolean;
  result: string;
  latencyText: string;
}

export interface TimelineLogEntry {
  timestampMs: number;
  message: string;
  level: 'normal' | 'highlight' | 'error';
}

@Component({
  selector: 'app-cold-start-availability',
  templateUrl: './cold-start-availability.component.html',
  standalone: false,
  styleUrl: './cold-start-availability.component.scss'
})
export class ColdStartAvailabilityComponent implements OnInit, OnDestroy {
  private readonly wave2DelayMs = 4000;
  private readonly hungThresholdMs = 5000;

  private t0 = 0;
  private wave2TimerId: ReturnType<typeof setTimeout> | null = null;
  private statusIntervalId: ReturnType<typeof setInterval> | null = null;

  public wave1Records: AvailabilityProbeRecord[] = [];
  public wave2Records: AvailabilityProbeRecord[] = [];
  public wave2Started = false;

  public verdictState: VerdictState = 'running';
  public verdictText = 'Running cold-start probe...';
  public elapsedClockText = 't = 0.0s';
  public wave1SummaryText = '0 / 0 settled';
  public wave2SummaryText = 'Scheduled in 4.0s';
  public logs: TimelineLogEntry[] = [];

  private readonly apis: BuiltInAiApiDefinition[] = [
    {
      id: 'Summarizer',
      label: 'Summarizer.availability()',
      targetOfBug: true,
      call: () => {
        const g = globalThis as Record<string, unknown>;
        const api = g['Summarizer'] as { availability?: () => Promise<string> } | undefined;
        return typeof api?.availability === 'function' ? api.availability() : null;
      },
    },
    {
      id: 'LanguageModel',
      label: 'LanguageModel.availability()',
      targetOfBug: true,
      call: () => {
        const g = globalThis as Record<string, unknown>;
        const api = g['LanguageModel'] as { availability?: () => Promise<string> } | undefined;
        return typeof api?.availability === 'function' ? api.availability() : null;
      },
    },
    {
      id: 'Writer',
      label: 'Writer.availability()',
      targetOfBug: true,
      call: () => {
        const g = globalThis as Record<string, unknown>;
        const api = g['Writer'] as { availability?: () => Promise<string> } | undefined;
        return typeof api?.availability === 'function' ? api.availability() : null;
      },
    },
    {
      id: 'Rewriter',
      label: 'Rewriter.availability()',
      targetOfBug: true,
      call: () => {
        const g = globalThis as Record<string, unknown>;
        const api = g['Rewriter'] as { availability?: () => Promise<string> } | undefined;
        return typeof api?.availability === 'function' ? api.availability() : null;
      },
    },
    {
      id: 'Proofreader',
      label: 'Proofreader.availability()',
      targetOfBug: true,
      call: () => {
        const g = globalThis as Record<string, unknown>;
        const api = g['Proofreader'] as { availability?: () => Promise<string> } | undefined;
        return typeof api?.availability === 'function' ? api.availability() : null;
      },
    },
    {
      id: 'LanguageDetector',
      label: 'LanguageDetector.availability() [control]',
      targetOfBug: false,
      call: () => {
        const g = globalThis as Record<string, unknown>;
        const api = g['LanguageDetector'] as { availability?: () => Promise<string> } | undefined;
        return typeof api?.availability === 'function' ? api.availability() : null;
      },
    },
    {
      id: 'Translator',
      label: 'Translator.availability() [control]',
      targetOfBug: false,
      call: () => {
        const g = globalThis as Record<string, unknown>;
        const api = g['Translator'] as {
          availability?: (opts: { sourceLanguage: string; targetLanguage: string }) => Promise<string>;
        } | undefined;
        return typeof api?.availability === 'function'
          ? api.availability({ sourceLanguage: 'en', targetLanguage: 'es' })
          : null;
      },
    },
  ];

  constructor(@Inject(PLATFORM_ID) private readonly platformId: Object) {
    this.wave1Records = this.createPlaceholderRecords();
    this.wave2Records = this.createPlaceholderRecords();
  }

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.t0 = performance.now();
    this.runWave('Wave 1', this.wave1Records);

    this.wave2TimerId = setTimeout(() => {
      this.startWave2('scheduled +4000ms timer');
    }, this.wave2DelayMs);

    this.statusIntervalId = setInterval(() => {
      this.updateAllStatuses();
    }, 100);
  }

  ngOnDestroy(): void {
    if (this.wave2TimerId !== null) {
      clearTimeout(this.wave2TimerId);
      this.wave2TimerId = null;
    }
    if (this.statusIntervalId !== null) {
      clearInterval(this.statusIntervalId);
      this.statusIntervalId = null;
    }
  }

  public fireWave2Manual(): void {
    this.startWave2('manual button click');
  }

  public fireExtraProbe(): void {
    this.logEvent('Running extra on-demand probe across target Built-In AI APIs...');
    for (const api of this.apis) {
      if (!api.targetOfBug) {
        continue;
      }
      const start = performance.now();
      try {
        const promise = api.call();
        if (promise) {
          promise.then(
            (res) => {
              const duration = Math.round(performance.now() - start);
              this.logEvent(`[Extra Probe] ${api.id}.availability() -> "${res}" in ${duration}ms`, 'highlight');
            },
            (err) => {
              const duration = Math.round(performance.now() - start);
              this.logEvent(`[Extra Probe] ${api.id}.availability() rejected -> ${err} in ${duration}ms`, 'error');
            }
          );
        } else {
          this.logEvent(`[Extra Probe] ${api.id} is not exposed in this browser.`, 'normal');
        }
      } catch (err) {
        this.logEvent(`[Extra Probe] ${api.id}.availability() error: ${err}`, 'error');
      }
    }
  }

  private createPlaceholderRecords(): AvailabilityProbeRecord[] {
    return this.apis.map((api) => ({
      api,
      status: 'WAITING',
      startTime: 0,
      settled: false,
      missing: false,
      result: '—',
      latencyText: '—',
    }));
  }

  private nowMs(): number {
    return Math.max(0, Math.round(performance.now() - this.t0));
  }

  private logEvent(message: string, level: 'normal' | 'highlight' | 'error' = 'normal'): void {
    this.logs.push({
      timestampMs: this.nowMs(),
      message,
      level,
    });
  }

  private startWave2(triggerReason: string): void {
    if (this.wave2TimerId !== null) {
      clearTimeout(this.wave2TimerId);
      this.wave2TimerId = null;
    }
    this.wave2Started = true;
    this.logEvent(`Triggering Wave 2 (${triggerReason}).`, 'highlight');
    this.runWave('Wave 2', this.wave2Records);
  }

  private runWave(waveName: string, targetArray: AvailabilityProbeRecord[]): void {
    targetArray.length = 0;

    for (const api of this.apis) {
      const startTime = performance.now();
      const record: AvailabilityProbeRecord = {
        api,
        status: 'PENDING',
        startTime,
        settled: false,
        missing: false,
        result: '—',
        latencyText: '0ms (waiting...)',
      };
      targetArray.push(record);

      let promise: Promise<string> | null = null;
      try {
        promise = api.call();
      } catch (err) {
        record.settled = true;
        record.status = 'REJECTED';
        record.result = String(err);
        record.latencyText = '0ms';
        this.logEvent(`${waveName} ${api.id}.availability() threw synchronously: ${record.result}`, 'error');
        continue;
      }

      if (!promise) {
        record.settled = true;
        record.missing = true;
        record.status = 'UNEXPOSED';
        record.result = 'API not enabled';
        record.latencyText = '—';
        continue;
      }

      promise.then(
        (value) => {
          const durationMs = Math.round(performance.now() - startTime);
          record.settled = true;
          record.status = 'RESOLVED';
          record.result = `"${String(value)}"`;
          record.latencyText = `${durationMs}ms`;
          this.logEvent(
            `${waveName} ${api.id}.availability() resolved -> "${String(value)}" in ${durationMs}ms`,
            'highlight'
          );
          this.updateAllStatuses();
        },
        (err) => {
          const durationMs = Math.round(performance.now() - startTime);
          record.settled = true;
          record.status = 'REJECTED';
          record.result = String(err);
          record.latencyText = `${durationMs}ms`;
          this.logEvent(
            `${waveName} ${api.id}.availability() rejected -> ${record.result} in ${durationMs}ms`,
            'error'
          );
          this.updateAllStatuses();
        }
      );
    }

    this.logEvent(`Started ${waveName} (${this.apis.length} availability probes).`);
    this.updateAllStatuses();
  }

  private formatWaveSummary(records: AvailabilityProbeRecord[]): string {
    const active = records.filter((r) => !r.missing);
    const settled = active.filter((r) => r.settled);
    return `${settled.length} / ${active.length} settled`;
  }

  private updateAllStatuses(): void {
    const now = performance.now();
    const elapsedSec = ((now - this.t0) / 1000).toFixed(1);
    this.elapsedClockText = `t = ${elapsedSec}s`;

    for (const list of [this.wave1Records, this.wave2Records]) {
      for (const rec of list) {
        if (!rec.settled && !rec.missing && rec.status !== 'WAITING') {
          const waitMs = Math.round(now - rec.startTime);
          rec.latencyText = `${waitMs}ms (waiting...)`;
          if (waitMs >= this.hungThresholdMs) {
            rec.status = 'HUNG';
          }
        }
      }
    }

    this.wave1SummaryText = this.formatWaveSummary(this.wave1Records);
    if (this.wave2Started) {
      this.wave2SummaryText = this.formatWaveSummary(this.wave2Records);
    } else {
      const remaining = Math.max(0, (this.wave2DelayMs - (now - this.t0)) / 1000).toFixed(1);
      this.wave2SummaryText = `Scheduled in ${remaining}s`;
    }

    const w1Target = this.wave1Records.filter((r) => r.api.targetOfBug && !r.missing);
    const w2Target = this.wave2Records.filter((r) => r.api.targetOfBug && !r.missing);

    if (w1Target.length === 0) {
      this.verdictState = 'fail';
      this.verdictText =
        'No target Built-In AI APIs (Summarizer, LanguageModel, Writer, Rewriter, Proofreader) are exposed in this browser.';
      return;
    }

    const w1Pending = w1Target.filter((r) => !r.settled);
    const w2Settled = w2Target.filter((r) => r.settled);

    const scenarioAMismatch =
      this.wave2Started &&
      w2Settled.some((w2Rec) => {
        const matchingW1 = w1Target.find((w1Rec) => w1Rec.api.id === w2Rec.api.id);
        return matchingW1 && !matchingW1.settled;
      });

    if (scenarioAMismatch) {
      this.verdictState = 'fail';
      this.verdictText =
        'BUG REPRODUCED (Scenario A): Wave 2 (+4s) resolved immediately while Wave 1 (0ms) is still stuck pending!';
      return;
    }

    const anyHung = w1Pending.some((r) => now - r.startTime >= this.hungThresholdMs);
    if (anyHung) {
      this.verdictState = 'fail';
      this.verdictText = `BUG REPRODUCED: ${w1Pending.length} Wave 1 availability() call(s) still hung after >5s!`;
      return;
    }

    if (w1Pending.length === 0 && (!this.wave2Started || w2Target.every((r) => r.settled))) {
      this.verdictState = 'pass';
      this.verdictText = this.wave2Started
        ? 'PASS: All Wave 1 (cold start) and Wave 2 (+4s) availability() calls settled cleanly.'
        : 'Wave 1 (cold start) settled cleanly! Waiting for Wave 2 (+4s) confirmation...';
      return;
    }

    this.verdictState = 'running';
    this.verdictText = 'Waiting for availability() promises to settle...';
  }
}
