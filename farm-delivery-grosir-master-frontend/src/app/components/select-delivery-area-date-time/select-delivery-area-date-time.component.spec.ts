import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SelectDeliveryAreaDateTimeComponent } from './select-delivery-area-date-time.component';

describe('SelectDeliveryAreaDateTimeComponent', () => {
  let component: SelectDeliveryAreaDateTimeComponent;
  let fixture: ComponentFixture<SelectDeliveryAreaDateTimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectDeliveryAreaDateTimeComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectDeliveryAreaDateTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
