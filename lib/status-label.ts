import type { ResolvedStatus } from "./types";

export function labelFor(status: ResolvedStatus): string {
  switch (status) {
    case "live":
      return "Live";
    case "paused":
      return "Paused";
    case "offline":
      return "Offline";
    case "archived":
      return "Archived";
    case "wip":
      return "In progress";
    default:
      return "Checking…";
  }
}
