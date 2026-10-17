# GitHub Actions deployment to Windows IIS

The workflow in `.github/workflows/deploy-iis.yml` deploys two branches to two IIS sites:

| Branch | GitHub environment | IIS site |
| --- | --- | --- |
| `develop` | `development` | Development / testing site |
| `main` | `production` | Live site used by end users |

Pull requests into `main` or `develop` only build the app (CI). A push or merge into `develop` or `main` builds the app and then deploys it (CD) from a Windows self-hosted runner on the IIS server. Feature branches never deploy.

The same setup works on an on-premises Windows Server or an AWS EC2 Windows instance. The runner only needs outbound HTTPS access to GitHub; no inbound ports need to be opened for deployment.

## Branch workflow

```
feature/xyz ──PR──▶ develop ──(auto deploy)──▶ development site
                       │
                       └──PR──▶ main ──(auto deploy)──▶ production site
```

1. Create feature branches from `develop` (`git checkout develop && git pull && git checkout -b feature/xyz`).
2. Open a pull request from the feature branch into `develop`. The build job must pass.
3. After merging, the app deploys to the development site. Test it there.
4. When it is ready for release, open a pull request from `develop` into `main`. After merging, the app deploys to production.
5. For an urgent production fix, branch from `main` (`hotfix/xyz`), open a PR into `main`, then merge `main` back into `develop`.

In **Settings > Branches**, add branch protection rules for `main` and `develop`: require a pull request and require the `Build` status check to pass.

## GitHub repository configuration

### Repository variables (used by pull request builds)

Open **Settings > Secrets and variables > Actions > Variables** and add `NEXT_PUBLIC_BACKEND_API` (any valid backend URL, for example the development backend) plus any other `NEXT_PUBLIC_*` values the build needs.

### Environment variables (used by deployments)

Open **Settings > Environments** and create two environments: `development` and `production`. Add these variables to **each** environment with that environment's values:

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_BACKEND_API` | Yes | Absolute backend URL for this environment. |
| `IIS_DEPLOY_PATH` | Yes | Existing IIS website physical-path directory, for example `C:\inetpub\gis-app-dev` or `C:\inetpub\gis-app`. |
| `IIS_APP_POOL` | Yes | IIS application pool of that website. |
| `NEXT_PUBLIC_GOOGLE_MAP_API` | If used | Google Maps API key. |
| `NEXT_PUBLIC_GOOGLE_MAP_ID` | If used | Google Maps map ID. |
| `NEXT_PUBLIC_GOOGLE_MAP_Reduce_ID` | If used | Reduced Google Maps map ID. |
| `NEXT_PUBLIC_CKEDITOR5_LICENSE_KEY` | If used | CKEditor license key. |
| `NEXT_PUBLIC_SAPLING_KEY` | If used | Sapling public key. |

Environment variables override repository variables with the same name. Optionally, add **Required reviewers** to the `production` environment so production deployments wait for approval.

All `NEXT_PUBLIC_*` values are included in the browser build and are visible to users. Restrict public API keys (for example, by allowed website referrers) and do not place private credentials in these variables.

## One-time work for the server administrator

This is not performed by the repository workflow:

1. Install a supported Node.js LTS version (at `C:\Program Files\nodejs`, as `gis-app-master/web.config` expects), IIS, IIS URL Rewrite, and `iisnode`.
2. Create two IIS websites, each with its own application pool and folder, for example:
   - `gis-app-dev` → `C:\inetpub\gis-app-dev` (development, e.g. `dev.example.com` or a different port)
   - `gis-app` → `C:\inetpub\gis-app` (production)
3. Install a GitHub Actions Windows self-hosted runner on the server (**Settings > Actions > Runners > New self-hosted runner > Windows**) and install it as a Windows service. Add the custom label `iis`; the workflow also requires the default `self-hosted` and `windows` labels.
4. Grant the runner's Windows service account write permission on both site folders and permission to stop and start both application pools with IIS `appcmd.exe` (running the service as a local administrator account is the simplest option).
5. Set up the website bindings, DNS, firewall, TLS certificates, and any required server-side environment settings.

On each deployment, the workflow stops the application pool, copies the built app, its dependencies, and `web.config` into `IIS_DEPLOY_PATH`, then starts the application pool again. It does not configure IIS, install the runner, or create server bindings.

## Checking a deployment

Open the **Actions** tab on GitHub, select the run, and check the **Build** and **Deploy to IIS** jobs. Then verify the site, backend connectivity, and the map/editor features. A deployment can be re-run manually with **Run workflow** (on `main` or `develop`).
