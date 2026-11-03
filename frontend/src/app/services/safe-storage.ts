// localStorage puede lanzar en ventanas privadas o con los datos bloqueados
const memory = new Map<string, string>();

export const safeStorage = {
  get(key: string): string | null {
    try {
      return window.localStorage.getItem(key) ?? memory.get(key) ?? null;
    } catch {
      return memory.get(key) ?? null;
    }
  },
  set(key: string, value: string) {
    memory.set(key, value);
    try {
      window.localStorage.setItem(key, value);
    } catch {
      // Se queda en memoria hasta que se cierre la pestaña
    }
  },
  remove(key: string) {
    memory.delete(key);
    try {
      window.localStorage.removeItem(key);
    } catch {
      // Nada que limpiar
    }
  },
};
