# GitHub Actions deployment to Windows IIS

The workflow in `.github/workflows/deploy-iis.yml` builds pull requests to `main`. After a change is merged into `main`, it builds the production app on GitHub-hosted Windows and deploys from a Windows self-hosted runner on the IIS server. Feature branches do not deploy automatically.

## GitHub repository configuration

Open **Settings > Secrets and variables > Actions > Variables** and add:

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_BACKEND_API` | Yes | Absolute production backend URL. |
| `IIS_DEPLOY_PATH` | Yes | Existing IIS website physical-path directory on the server. |
| `IIS_APP_POOL` | Yes | IIS application pool name to recycle after copying. |
| `NEXT_PUBLIC_GOOGLE_MAP_API` | If used | Google Maps API key. |
| `NEXT_PUBLIC_GOOGLE_MAP_ID` | If used | Google Maps map ID. |
| `NEXT_PUBLIC_GOOGLE_MAP_Reduce_ID` | If used | Reduced Google Maps map ID. |
| `NEXT_PUBLIC_CKEDITOR5_LICENSE_KEY` | If used | CKEditor license key. |
| `NEXT_PUBLIC_SAPLING_KEY` | If used | Sapling public key. |

All `NEXT_PUBLIC_*` values are included in the browser build and are visible to users. Restrict public API keys (for example, by allowed website referrers) and do not place private credentials in these variables. Add private values as GitHub Secrets and expose them to the workflow only if server-side application code needs them.

## One-time work for the server administrator

This is not performed by the repository workflow:

1. Install a supported Node.js LTS version, IIS, IIS URL Rewrite, and `iisnode` compatible with the server and the repository's `gis-app-master/web.config`.
2. Install and register a GitHub Actions Windows self-hosted runner on this server. Add the custom label `iis`; the workflow also requires the default `self-hosted` and `windows` labels.
3. Create `IIS_DEPLOY_PATH`, set the IIS website's physical path to that directory, and grant the runner's Windows account permission to write there.
4. Grant the runner account permission to recycle `IIS_APP_POOL` using IIS `appcmd.exe`.
5. Set up the website binding, DNS, firewall/network access, TLS certificate, and any required server-side environment settings.

The workflow copies the built app, dependencies, and `web.config` into `IIS_DEPLOY_PATH`, then recycles the configured application pool. It does not configure IIS, install the runner, or create/modify server bindings.

## Release process

1. Push changes to a feature branch and open a pull request targeting `main`. The build job checks that the app can install dependencies and build.
2. Merge the pull request into `main` after review and a passing build.
3. The deploy job runs only for the `main` push and waits for the self-hosted runner labelled `iis`.
4. Check the workflow run and then verify the deployed site, backend connectivity, and any map/editor features.
