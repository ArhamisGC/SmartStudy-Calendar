import {Component, OnInit} from '@angular/core';
import { UserService } from '../../services/user.service'
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from "@angular/forms";

@Component({
  selector: 'app-loginregister',
  templateUrl: './loginregister.component.html',
  styleUrls: ['./loginregister.component.css']
})
export class LoginregisterComponent implements OnInit {
  registerForm!: FormGroup;
  loginForm!: FormGroup;
  backendErrorMessageLogin: string | null = null;
  backendErrorMessageRegister: string | null = null;
  userData: any = {};
  constructor(private toastr:ToastrService,private router: Router,private userService: UserService) {}

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      nombreCompleto: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required,this.confirmPasswordValidator('password')]),
      universidad: new FormControl('', [Validators.required]),
      telefono: new FormControl('', [Validators.required,this.telephoneValidator()]),
      fechaNacimiento: new FormControl('', [Validators.required]),
    });

    this.loginForm = new FormGroup({
      emailLogin: new FormControl('', [Validators.required, Validators.email]),
      passwordLogin: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });


    const container = document.getElementById('container');
    const registerBtn = document.getElementById('register');
    const loginBtn = document.getElementById('login');

    if (container && registerBtn && loginBtn) {
      registerBtn.addEventListener('click', () => {
        container.classList.add("active");
      });

      loginBtn.addEventListener('click', () => {
        container.classList.remove("active");
      });
    } else {
      console.error('Elements not found.');
    }
  }

  get nombreCompleto(){
    return this.registerForm.get('nombreCompleto');
  }
  get email(){
    return this.registerForm.get('email');
  }

  get password(){
    return this.registerForm.get('password');
  }
  get confirmPassword(){
    return this.registerForm.get('confirmPassword');
  }

  get universidad(){
    return this.registerForm.get('universidad');
  }

  get telefono(){
    return this.registerForm.get('telefono');
  }
  get fechaNacimiento(){
    return this.registerForm.get('fechaNacimiento');
  }

  get emailLogin(){
    return this.loginForm.get('emailLogin');
  }

  get passwordLogin(){
    return this.loginForm.get('passwordLogin');
  }

  registerUser() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched()
      return;
    }
    this.userData = this.registerForm.value;

    this.userService.register(this.userData).then(() => {
      this.toastr.success('Usuario registrado con éxito', '¡Bienvenido a SmartStudy Calendar!');
      const container = document.getElementById('container');
      if (container) {
        container.classList.remove("active");
      }
    }).catch(error => {
      this.backendErrorMessageRegister = error.message;
    });
  }

  loginUser() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return
    }
    const {emailLogin, passwordLogin} = this.loginForm.value;
    this.userService.login({password: passwordLogin,email: emailLogin}).then(() => {
        this.router.navigate(['/dashboard']);
      }).catch(error => {
        this.backendErrorMessageLogin = error.message;
      });
    }

  confirmPasswordValidator(controlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const confirmPasswordControl = control.root.get(controlName);
      if (confirmPasswordControl && confirmPasswordControl.value !== control.value) {
        return { confirmPasswordMismatch: true };
      }
      return null;
    };
  }
  telephoneValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const telefonoPattern = /^[0-9]{9}$/;
      if (control.value && !telefonoPattern.test(control.value)) {
        return { telefonoInvalido: true };
      }
      return null;
    };
  }

  resetForms() {
    this.loginForm.markAsUntouched();
    this.registerForm.markAsUntouched();
    this.backendErrorMessageLogin = null;
    this.backendErrorMessageRegister = null;
  }

}
