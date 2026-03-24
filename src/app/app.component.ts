import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { delay, filter, takeUntil } from 'rxjs/operators';
import { LoadingService } from './services/loading.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  title = 'appangular';
  isLoading$: Observable<boolean>;
  viewReady = false;
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private loadingService: LoadingService
  ) {
    // Defer one tick to avoid ExpressionChangedAfterItHasBeenCheckedError on initial navigation.
    this.isLoading$ = this.loadingService.isLoading$.pipe(delay(0));
  }

  ngOnInit() {
    this.router.events.pipe(
      filter((event) =>
        event instanceof NavigationStart ||
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ),
      takeUntil(this.destroy$)
    ).subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.loadingService.setNavigationLoading(true);
      } else {
        this.loadingService.setNavigationLoading(false);
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.viewReady = true;
    });
  }
}
