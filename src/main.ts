import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
import { HttpHandlerFn, HttpRequest, provideHttpClient, withInterceptors } from '@angular/common/http';

function logginInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  console.log("OUTGOING REQUEST INTERCEPTED");
  console.log(req);
  // const request = req.clone({
  //   headers: req.headers.set('X-DEBUG', 'TESTING'),
  // })
  return next(req);
}

bootstrapApplication(AppComponent,  {
  providers: [provideHttpClient(
    withInterceptors([logginInterceptor])
  )]
}).catch((err) => console.error(err));
