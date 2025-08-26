import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component'; // Corrigido aqui

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent], // Corrigido aqui
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent); // Corrigido aqui
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'LuPA' title`, () => { // Teste atualizado para o nome do app
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.appName).toEqual('LuPA');
  });
});