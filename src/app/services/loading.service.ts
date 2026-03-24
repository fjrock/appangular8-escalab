import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private pendingRequests$ = new BehaviorSubject<number>(0);
  private navigationLoading$ = new BehaviorSubject<boolean>(false);

  readonly isLoading$: Observable<boolean> = combineLatest([
    this.pendingRequests$,
    this.navigationLoading$
  ]).pipe(
    map(([pendingRequests, navigationLoading]) => pendingRequests > 0 || navigationLoading)
  );

  setNavigationLoading(isLoading: boolean) {
    this.navigationLoading$.next(isLoading);
  }

  startRequest() {
    this.pendingRequests$.next(this.pendingRequests$.value + 1);
  }

  endRequest() {
    const nextValue = Math.max(this.pendingRequests$.value - 1, 0);
    this.pendingRequests$.next(nextValue);
  }
}
