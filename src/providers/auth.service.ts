import { Injectable } from "@angular/core";
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore'
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/operator/switchMap'
import { User } from "../form/user";



@Injectable()
export class AuthService {

    user: Observable<User>;  //항상 user의 로그인 상태를 check
    userCheck: Observable<User> //로그인 할 때 한 번만(take(1)써서) valid한 user인지 check

    constructor(private afAuth: AngularFireAuth,
        private afs: AngularFirestore,
    ) {
        this.user = this.afAuth.authState
            .switchMap(user => {
                if (user) {
                    return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
                }
                else {
                    return Observable.of(null);
                }
            });

        this.userCheck = this.afAuth.authState
            .switchMap(user => {
                if (user) {
                    return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
                }
                else {
                    return Observable.of(null);
                }
            }).take(1);
    }

    // googleLogin() {
    //     const provider = new firebase.auth.GoogleAuthProvider()
    //     return this.oAuthLogin(provider);
    // }

    loginUser(newEmail: string, newPassword: string): Promise<any> {
        return this.afAuth.auth.signInWithEmailAndPassword(newEmail, newPassword)
    }

    // private oAuthLogin(provider) {
    //     return this.afAuth.auth.signInWithPopup(provider)
    //         .then((credential) => {
    //             this.updateUserData(credential.user)
    //         })
    // }

    // private updateUserData(user) {
    //     const userRef = this.afs.doc(`users/${user.uid}`);
    //     const data: User = {
    //         uid: user.uid,
    //         email: user.email,
    //         displayName : user.displayName,
    //         thumbnail : user.thumbnail,
    //         roles: {
    //             subscriber: true,
    //             editor: false,
    //             admin: false
    //         }
    //     }
    //     return userRef.set(data, { merge: true })
    // }

    private checkAuthorization(user: User, allowedRoles: string[]): boolean {
        if (!user) return false;

        for (var i = 0; i < allowedRoles.length; i++) {
            if (user.role === allowedRoles[i]) {
                return true;
            }
        }
        return false;
    }

    canRead(user: User): boolean {
        const allowed = ['admin', 'editor', 'subscriber']
        return this.checkAuthorization(user, allowed)
    }

    canEdit(user: User): boolean {
        const allowed = ['admin', 'editor']
        return this.checkAuthorization(user, allowed)
    }

    canDelete(user: User): boolean {
        const allowed = ['admin']
        return this.checkAuthorization(user, allowed)
    }


    logout(){
        return this.afAuth.auth.signOut();
    }
}