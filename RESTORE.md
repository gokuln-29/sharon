# Database backup & restore

The entire app's data lives in one file: `dev.db` at the project root.

## Where backups are stored

`D:\SharonBackups\`

| File pattern | Kept |
|---|---|
| `dev-weekly-YYYY-MM-DD.db` | Last 12 Sundays (~3 months) |
| `backup.log` | Append-only run log |

A new backup runs automatically **every Sunday at 2:00 PM** (Windows Task Scheduler task name: `SharonDBBackup`). The script uses SQLite's online backup API, so it's safe to run while the app is open. The PC must be on at the scheduled time; if it's off, the task will run as soon as the PC is next available.

## How to restore

1. **Stop the app.** If `npm run dev` is running, press `Ctrl+C` in that terminal.
2. **Copy the chosen backup** from `D:\SharonBackups\` to the project root.
3. **Rename it** to exactly `dev.db` (overwrite any broken one already there).
4. **Start the app:** `npm run dev`. All data from that backup's date is back.

## Run a backup manually (anytime)

Double-click `scripts\run-backup.cmd`, or:

```
node scripts\backup-db.mjs
```

Output goes to the console; the scheduled-task version appends to `D:\SharonBackups\backup.log`.

## Verify a backup file before trusting it

Install [DB Browser for SQLite](https://sqlitebrowser.org/) (free). Open the `.db` file → click the `OPRegister` table → confirm your records are there.

## Check that the scheduled task is healthy

```
Get-ScheduledTaskInfo -TaskName "SharonDBBackup"
```

- `LastTaskResult: 0` = last run succeeded.
- `NextRunTime` shows the next scheduled run.
- Open `D:\SharonBackups\backup.log` to see the history.

## Moving backups to cloud later

When Google Drive (or OneDrive) is mounted, edit `BACKUP_DIR` in [scripts/backup-db.mjs](scripts/backup-db.mjs) to the new path (e.g. `G:\\My Drive\\SharonBackups`). The task picks it up on next run — no need to re-register.
