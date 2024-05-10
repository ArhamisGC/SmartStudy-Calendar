import {Component, Inject, OnInit} from '@angular/core';
import {UserService} from "../../services/user.service";
import {User} from "../../interfaces/user.interface";
import {animate, style, transition, trigger} from "@angular/animations";
import {DOCUMENT} from "@angular/common";
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
  animations: [
    trigger('dialog', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.9)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'scale(1)' })),
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'scale(0.9)' }))
      ])
    ])
  ]
})

export class ProfileComponent implements OnInit {
  userData: User = {
    profilePicture: 'https://via.placeholder.com/250',
    nombreCompleto: '',
    email: '',
    telefono: '',
    universidad: '',
    fechaNacimiento: new Date,
    password: '',
    confirmPassword: ''
  };
  isEditing = false;
  tempUser!:User;


  constructor(@Inject(DOCUMENT) private document: Document,private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUserData().subscribe((userData: User) => {
      if (userData) {
        this.userData = userData;
        this.tempUser = {...userData};
      }
    });
  }

  editProfile() {
    this.isEditing = true;
    this.tempUser = {...this.userData};
  }

  saveProfile() {
    if (this.tempUser) {
      const updatedUserData: Partial<User> = {};

      if (this.tempUser.profilePicture !== undefined) {
        updatedUserData.profilePicture = this.tempUser.profilePicture;
      }
      if (this.tempUser.universidad !== undefined) {
        updatedUserData.universidad = this.tempUser.universidad;
      }
      if (this.tempUser.telefono !== undefined) {
        updatedUserData.telefono = this.tempUser.telefono;
      }
      if (this.tempUser.nombreCompleto !== undefined) {
        updatedUserData.nombreCompleto = this.tempUser.nombreCompleto;
      }

      this.userService.updateUserData(this.userService.getUID(), updatedUserData)
        .then(() => {
          this.userData = {...this.userData, ...updatedUserData};
          this.isEditing = false;
        })
        .catch((error) => {
          console.error('Error updating user data: ', error);
        });
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.userService.uploadProfilePicture(file)
        .then((downloadURL) => {
          this.tempUser.profilePicture = downloadURL;
          this.userService.updateUserData(this.userService.getUID(), {profilePicture: downloadURL})
            .then(() => {
              this.userData.profilePicture = downloadURL;
            })
            .catch((error) => {
              console.error('Error updating profile picture URL in Firebase:', error);
            });
        })
        .catch((error) => {
          console.error('Error uploading profile picture:', error);
        });
    }
  }

  openFileInput() {
    this.document.getElementById('file')?.click();
  }

}
