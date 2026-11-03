import { Injectable, signal } from '@angular/core';
import { HubConnectionBuilder, HubConnection } from '@microsoft/signalr';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CourseHubService {
  private connection: HubConnection | null = null;
  private updatesSubject = new Subject<{ courseId: string; status: string }>();

  updates$ = this.updatesSubject.asObservable();
  connectionState = signal<'connected' | 'reconnecting' | 'disconnected'>('disconnected');

  start() {
    this.connection = new HubConnectionBuilder()
      .withUrl('/hubs/course', {
        withCredentials: true // Required so the browser attaches your HttpOnly auth cookie during handshake
      })
      .withAutomaticReconnect()
      .build();

    this.connection.on('CourseStatusChanged', (courseId, status) => {
      this.updatesSubject.next({ courseId, status });
    });

    this.connection.onreconnecting(() => this.connectionState.set('reconnecting'));
    this.connection.onreconnected(() => this.connectionState.set('connected'));
    this.connection.onclose(() => this.connectionState.set('disconnected'));

    this.connection.start().then(() => this.connectionState.set('connected'));
  }

  stop() {
    this.connection?.stop();
  }
}