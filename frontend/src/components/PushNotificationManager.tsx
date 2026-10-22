import React, { useCallback, useEffect, useState } from "react";
import { Bell, BellOff } from "lucide-react";
import {
  registerPushSubscription,
  unregisterPushSubscription,
} from "../services/api.js";

const STORAGE_KEY = "feh_push_subscribed";

export interface PushNotificationState {
  supported: boolean;
  subscribed: boolean;
  permission: NotificationPermission | "unsupported";
}

export function usePushNotifications(): {
  state: PushNotificationState;
  subscribe: () => Promise<void>;
  unsubscribe: () => Promise<void>;
} {
  const [state, setState] = useState<PushNotificationState>(() => {
    const supported =
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      "Notification" in window;

    const saved =
      typeof localStorage !== "undefined" &&
      localStorage.getItem(STORAGE_KEY) === "true";

    return {
      supported,
      subscribed: saved,
      permission: supported ? Notification.permission : "unsupported",
    };
  });

  // Registra o service worker na primeira carga
  useEffect(() => {
    if (!state.supported) return;

    navigator.serviceWorker
      .register("/sw.js")
      .catch((error) =>
        console.warn("[FEH] Falha ao registrar service worker:", error),
      );
  }, [state.supported]);

  const subscribe = useCallback(async () => {
    if (!state.supported) return;

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      setState((prev) => ({ ...prev, permission, subscribed: false }));
      return;
    }

    const registration = await navigator.serviceWorker.ready;
    void registration;
    const endpoint = `${self.location.origin}/push/${btoa(
      `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    )}`;

    await registerPushSubscription({ endpoint });

    localStorage.setItem(STORAGE_KEY, "true");
    setState({ supported: true, subscribed: true, permission: "granted" });
  }, [state.supported]);

  const unsubscribe = useCallback(async () => {
    const registration = await navigator.serviceWorker.ready;
    const subscriptions = await registration.pushManager.getSubscription();
    const endpoint = subscriptions?.endpoint;

    if (endpoint) {
      await unregisterPushSubscription(endpoint);
      await subscriptions.unsubscribe();
    }

    localStorage.removeItem(STORAGE_KEY);
    setState((prev) => ({ ...prev, subscribed: false }));
  }, []);

  return { state, subscribe, unsubscribe };
}

export const PushNotificationManager: React.FC = () => {
  const { state, subscribe, unsubscribe } = usePushNotifications();

  if (!state.supported) return null;

  return (
    <button
      onClick={() => (state.subscribed ? unsubscribe() : subscribe())}
      aria-label={
        state.subscribed
          ? "Desativar notificações push"
          : "Ativar notificações push"
      }
      className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 active:bg-white/40 backdrop-blur-md text-white font-semibold text-sm rounded-full shadow-lg border border-white/30 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-white"
    >
      {state.subscribed ? (
        <>
          <BellOff className="w-4 h-4" />
          <span>Desativar notificações</span>
        </>
      ) : (
        <>
          <Bell className="w-4 h-4" />
          <span>Ativar notificações</span>
        </>
      )}
    </button>
  );
};
