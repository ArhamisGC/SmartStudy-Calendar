import {Component, OnInit} from '@angular/core';
import { UserService } from '../../services/user.service';
import {User} from "../../interfaces/user.interface";
import {Router} from "@angular/router";
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  NgForm,
  ValidationErrors,
  ValidatorFn,
  Validators
} from "@angular/forms";

@Component({
  selector: 'app-loginregister',
  templateUrl: './loginregister.component.html',
  styleUrls: ['./loginregister.component.css']
})
export class LoginregisterComponent{
  registerForm!: FormGroup;
  userData: any = {};
  constructor(private formBuilder: FormBuilder,private router: Router,private userService: UserService) {}

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

  registerUser() {
    if (this.registerForm.invalid) {
      return;
    }
    this.userData = this.registerForm.value;

    this.userService.register(this.userData).then(() => {
      alert("Registro exitoso");
      const container = document.getElementById('container');
      if (container) {
        container.classList.remove("active");
      }
    }).catch(error => {
      alert('Error al registrar: ' + error);
    });
  }

  loginUser(form: NgForm) {
    if (form.valid) {
      const {email, password} = form.value;
      this.userService.login({email, password}).then(() => {
        console.log("Login successful")
        this.router.navigate(['/dashboard']);
      }).catch(error => {
        alert('Error al iniciar sesión: ' + error.message)
      });
    }else{
      alert('Rellena los campos correctamente')
    }
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

}
