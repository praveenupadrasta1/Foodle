import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BannerPage } from './banner.page';

describe('BannerPage', () => {
  let component: BannerPage;
  let fixture: ComponentFixture<BannerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BannerPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BannerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
