import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import {
  BarElement,
  CategoryScale,
  Chart,
  Legend,
  LinearScale, LineController,
  LineElement,
  PointElement,
  Title,
  Tooltip
} from 'chart.js';
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));

Chart.register(CategoryScale, LinearScale, LineController, LineElement, PointElement, Title, Tooltip, Legend);
