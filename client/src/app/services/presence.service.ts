import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
} from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr';
import { User } from '../models/user';
import { take } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class PresenceService {
  hubUrl = environment.hubsUrl;
  hubConnection?: HubConnection;
  toastr = inject(ToastrService);
  onlineUsers = signal<string[]>([]);
  router = inject(Router);

  createHubConnection(user: User) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'presence', {
        accessTokenFactory: () => user.token,
      })
      .withAutomaticReconnect()
      .build();
    console.log('hubconnection', this.hubConnection);

    this.hubConnection
      .start()
      .catch((error) => console.log('SignalR connection error:', error));

    this.hubConnection.on('UserIsOnline', (username) => {
      this.onlineUsers.update((users) => [...users, username]);
    });

    this.hubConnection.on('UserIsOffline', (username) => {
      this.onlineUsers.update((users) =>
        users.filter((user) => user !== username),
      );
    });

    this.hubConnection.on('GetOnlineUsers', (usernames) => {
      this.onlineUsers.set(usernames);
    });
    this.hubConnection.on('NewMessageReceived', ({ username, knownAs }) => {
      this.toastr
        .info(knownAs + ' has sent you a new mwssage! Click me to see it')
        .onTap.pipe(take(1))
        .subscribe(() =>
          this.router.navigateByUrl('/members/' + username + '?tab=Messages'),
        );
    });
  }

  stopHubConnection() {
    if (this.hubConnection?.state === HubConnectionState.Connected) {
      this.hubConnection.stop().catch((error) => console.log('stop', error));
    }
    this.onlineUsers.set([]);
  }
}
