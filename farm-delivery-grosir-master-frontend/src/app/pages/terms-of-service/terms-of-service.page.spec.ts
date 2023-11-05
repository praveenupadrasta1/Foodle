import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TermsOfServicePage } from './terms-of-service.page';

describe('TermsOfServicePage', () => {
  let component: TermsOfServicePage;
  let fixture: ComponentFixture<TermsOfServicePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TermsOfServicePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TermsOfServicePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
