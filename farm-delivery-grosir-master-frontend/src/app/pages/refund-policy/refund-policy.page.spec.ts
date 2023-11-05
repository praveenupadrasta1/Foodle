import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RefundPolicyPage } from './refund-policy.page';

describe('RefundPolicyPage', () => {
  let component: RefundPolicyPage;
  let fixture: ComponentFixture<RefundPolicyPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefundPolicyPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RefundPolicyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
