import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountPopoverComponent } from './account-popover.component';

import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@NgModule({
    declarations: [AccountPopoverComponent],
    exports: [AccountPopoverComponent],
    imports: [CommonModule, ReactiveFormsModule, IonicModule]
})
export class AccountPopoverModule{};