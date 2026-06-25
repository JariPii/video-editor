import { randomUUID } from 'node:crypto';

class MediaSerice {
  private files = new Map<string, string>();

  register(path: string): string {
    const id = randomUUID();

    this.files.set(id, path);

    return id;
  }

  get(id: string): string | undefined {
    return this.files.get(id);
  }

  remove(id: string): void {
    this.files.delete(id);
  }
}

export const mediaService = new MediaSerice();
