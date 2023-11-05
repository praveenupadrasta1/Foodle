import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";

import {CurrencyDecimalReplacePipe} from "./currency-decimal-replace.pipe";

@NgModule({
  declarations:[CurrencyDecimalReplacePipe],
  imports:[CommonModule],
  exports:[CurrencyDecimalReplacePipe]
})

export class MainPipeModule{}