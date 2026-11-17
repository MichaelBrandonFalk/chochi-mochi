# v3.7.0 release verification

Checked November 17, 2026. Immutable game source: tag v3.7.0, commit 8d334e2.

Windows and Linux packages passed their builds and packaged-app smoke checks in [desktop run 44121167958](https://github.com/MichaelBrandonFalk/chochi-mochi/actions/runs/44121167958). GitHub could not allocate its macOS arm64 runner and cancelled that job with the annotation: “The job was not acquired by Runner of type hosted even after multiple attempts.” The notices cited runner capacity constraints. This was a runner provisioning failure, not a game build failure.

The universal Mac DMG was built locally from the same game source with the repository’s desktop:build command. Both x86_64 and arm64 slices were confirmed with lipo. The packaged-app smoke check passed on macOS arm64, reporting a secure context, working storage, and loaded assets. The package uses the existing signing and distribution configuration.

Mac file: Chochi-Mochi-3.7.0-macOS-universal.dmg

SHA-256: 2c3324dc0dbc47872616e41f2af8f1460f2bd037b59187926c94c61816d3edc7

[Independent Mint verification 44124013308](https://github.com/MichaelBrandonFalk/chochi-mochi/actions/runs/44124013308) passed. It matched the original artifact run’s source SHA to the immutable release tag, downloaded that run’s exact Linux package, installed it using the standard signed Ubuntu repositories for the Mint 22 base, and launched the installed game’s self-test. This allowed Mint verification without waiting for an unrelated platform runner.

The game build retains all 110 passing automated checks and the art/audio checks in QA-v3.7.0.md. Six release files and SHA256SUMS.txt are published together. The release source tag remains unchanged; the added independent verification workflow and this audit note are maintenance records.
