import { Injectable } from "@angular/core";
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut} from "@angular/fire/auth";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {User} from "../interfaces/user.interface";
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from "@angular/fire/storage";
@Injectable({
  providedIn: 'root'
})

export class UserService {

  userToken: string | null = null;

  constructor(private auth: Auth, private afAuth: AngularFireAuth, private firestore: AngularFirestore) {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        user.getIdToken().then(token => {
          this.userToken = token;
          localStorage.setItem('userToken', token);
        });
      } else {
        this.userToken = null;
        localStorage.removeItem('userToken');
      }
    });
  }

  async register(userData: User) {
    const {email, password, nombreCompleto, telefono, universidad, fechaNacimiento} = userData;

    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      return await this.firestore.collection('users').doc(userCredential.user.uid).set({
        uid: userCredential.user.uid,
        email,
        nombreCompleto,
        telefono,
        universidad,
        fechaNacimiento
      });
    } catch (error:any) {
      let errorMessage: string;
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Este correo electrónico ya está en uso.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'El correo electrónico no es válido.';
          break;
        case 'auth/operation-not-allowed':
          errorMessage = 'La creación de cuentas con correo electrónico/contraseña no está habilitada.';
          break;
        case 'auth/weak-password':
          errorMessage = 'La contraseña no es lo suficientemente fuerte.';
          break;
        default:
          errorMessage = 'Error al registrar el usuario.';
          break;
      }
      return await Promise.reject(new Error(errorMessage));
    }
  }

  async login(userData: { password: any; email: any }) {
    try {
      const result = await this.afAuth.signInWithEmailAndPassword(userData.email, userData.password);
    } catch (error:any) {
      let errorMessage: string;
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'No existe una cuenta con este correo electrónico.';
          break;
        case 'auth/invalid-credential':
          errorMessage = 'Email o contraseña incorrecta.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'El correo electrónico no es válido.';
          break;
        case 'auth/user-disabled':
          errorMessage = 'La cuenta correspondiente a este correo electrónico ha sido deshabilitada.';
          break;
        default:
          errorMessage = 'Error al iniciar sesión.';
          break;
      }
      return await Promise.reject(new Error(errorMessage));
    }
  }

  logout() {
    return signOut(this.auth);
  }


  getUserData(): any{
    if (this.auth.currentUser) {
      return this.firestore.collection('users').doc(this.auth.currentUser.uid).valueChanges();
    } else {
      // Manejar el caso en que this.auth.currentUser sea nulo
      return console.log('No user logged in')
    }
  }

  getUID() {
    return this.auth.currentUser?.uid;
  }

  updateUserData(uid: string | undefined, userData: Partial<User> | undefined) {
    if (uid && userData) {
      return this.firestore.collection('users').doc(uid).update(userData);
    } else {
      return Promise.reject('Error updating user data: uid or userData is undefined');
    }
  }

  uploadProfilePicture(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const storage = getStorage();
      const storageRef = ref(storage, 'userProfilePictures/' + file.name);

      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on('state_changed',
        (snapshot) => {
          // You can use this section to display the upload progress
        },
        (error) => {
          console.error('Upload failed:', error);
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log('File available at', downloadURL);
            resolve(downloadURL);
          });
        }
      );
    });
  }
}
