import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RegisComponent } from './regis.component';

describe('RegisComponent', () => {
  let component: RegisComponent;
  let fixture: ComponentFixture<RegisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});