import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
import { HttpEventType, HttpHandlerFn, HttpRequest, provideHttpClient, withInterceptors } from '@angular/common/http';
import { tap } from 'rxjs';

function logginInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  console.log("OUTGOING REQUEST INTERCEPTED");
  console.log(req);
  // const request = req.clone({
  //   headers: req.headers.set('X-DEBUG', 'TESTING'),
  // })
  return next(req).pipe(
    tap({
      next: (event) => {
        if (event.type === HttpEventType.Response) {
          console.log("INCOMIN RESPONSE INTERCEPTED");
          console.log(event.status);
          console.log(event.body);                   
        }
      },
    })
  );
}

bootstrapApplication(AppComponent,  {
  providers: [provideHttpClient(
    withInterceptors([logginInterceptor])
  )]
}).catch((err) => console.error(err));
