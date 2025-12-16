import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigManagerComponent } from './config-manager.component';

describe('ConfigManagerComponent', () => {
  let component: ConfigManagerComponent;
  let fixture: ComponentFixture<ConfigManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigManagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
