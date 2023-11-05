import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FirebaseAuthModalComponent } from './firebase-auth-modal.component';

describe('FirebaseAuthModalComponent', () => {
  let component: FirebaseAuthModalComponent;
  let fixture: ComponentFixture<FirebaseAuthModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FirebaseAuthModalComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FirebaseAuthModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
