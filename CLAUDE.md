# Project-Level Instructions

## Code Change Protocol

Before completing any code change:
1. Check @README.md for multi-location update patterns related to files being modified
2. When touching a file, look for related locations that need updating (e.g., config + CSS, types + implementation)
3. If multi-location updates are needed, warn user and get confirmation before proceeding
4. If new multi-location patterns are discovered or existing ones are no longer applicable, update @README.md accordingly