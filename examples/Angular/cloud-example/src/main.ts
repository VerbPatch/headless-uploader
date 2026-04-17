import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app.component';

bootstrapApplication(AppComponent).catch((err) => {
  // eslint-disable-next-line
  console.error(err);
});
