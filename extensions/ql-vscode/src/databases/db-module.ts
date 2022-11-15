import * as vscode from 'vscode';
import { ExtensionApp } from '../common/vscode/vscode-app';
import { isCanary, isNewQueryRunExperienceEnabled } from '../config';
import { logger } from '../logging';
import { DisposableObject } from '../pure/disposable-object';
import { DbConfigStore } from './db-config-store';
import { DbManager } from './db-manager';
import { DbPanel } from './ui/db-panel';

export class DbModule extends DisposableObject {
  public async initialize(
    extensionContext: vscode.ExtensionContext
  ): Promise<void> {
    if (extensionContext.extensionMode !== vscode.ExtensionMode.Development ||
      !isCanary() ||
      !isNewQueryRunExperienceEnabled()) {
      // Currently, we only want to expose the new database panel when we
      // are in development and canary mode and the developer has enabled the 
      // new query run experience.
      return;
    }

    void logger.log('Initializing database module');

    const app = new ExtensionApp(extensionContext);

    const dbConfigStore = new DbConfigStore(app);
    await dbConfigStore.initialize();

    const dbManager = new DbManager(dbConfigStore);
    const dbPanel = new DbPanel(dbManager);
    await dbPanel.initialize();
    extensionContext.subscriptions.push(dbPanel);

    this.push(dbPanel);
    this.push(dbConfigStore);
  }
}

export async function initializeDbModule(
  extensionContext: vscode.ExtensionContext
): Promise<DbModule> {
  const dbModule = new DbModule();
  await dbModule.initialize(extensionContext);
  return dbModule;
}
