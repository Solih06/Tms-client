import { HubConnectionBuilder } from "@microsoft/signalr";
import { Injectable, inject } from "@angular/core";
import { EnrollmentStore } from "../store/enrollment.store.js";
import { patchState } from "@ngrx/signals";
import { updateEntity } from "@ngrx/signals/entities";

@Injectable({ providedIn: "root" })
export class LiveSyncService {
  private store = inject(EnrollmentStore);
  private hubConnection = new HubConnectionBuilder()
    .withUrl("https://localhost:5166/hubs/enrollments")
    .build();

  connect() {
    this.hubConnection.on("EnrollmentStatusUpdated", (id: string, status: string) => {
      // Instantly patch the singleton SignalStore across all components
      patchState(this.store as never, updateEntity({ id, changes: { status } as never }));
    });
    this.hubConnection.start()
      .then(() => console.log('SignalR Hub Connected'))
      .catch(err => console.error("SignalR Connection Error", err));
  }
}
