import type { Migration } from './migration.interface';

export class MigrationRunner {
  constructor(private readonly migrations: Migration[]) {}

  async runAll(): Promise<void> {
    const ordered = [...this.migrations].sort((a, b) => a.version - b.version);

    for (const m of ordered) {
      console.log(`Running migration v${m.version}: ${m.name}`);
      await m.up();
      console.log(`Done: ${m.name}`);
    }
  }
}
