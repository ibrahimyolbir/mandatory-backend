import { BehaviorSubject } from 'rxjs';

export const username$ = new BehaviorSubject(window.localStorage.getItem('username') || null);

export function updateUsername(newUsername) {
    if (!newUsername) {
        window.localStorage.removeItem('username');
    }
    else {
        window.localStorage.setItem('username', newUsername);
    }
    username$.next(newUsername);
}

export function removeUsername() {
    window.localStorage.removeItem('username');
    username$.next(null);
}