import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import {provideRouter, withComponentInputBinding} from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import {provideHttpClient, withFetch, withInterceptors, withInterceptorsFromDi} from '@angular/common/http';
import {CookieService} from 'ngx-cookie-service';
import {credentialsInterceptor} from './shared/interceptors/credentials.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes,withComponentInputBinding()), provideClientHydration(withEventReplay()),provideHttpClient(withInterceptorsFromDi(),withInterceptors([credentialsInterceptor]),withFetch()),CookieService]
};
