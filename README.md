# Firestore security rules coverage report

A Github Action that report lack of test rule line.

## Usage:
### pull_request event

### Inputs

- `token` - The GITHUB_TOKEN secret.
- `report-url` - The report URL of firestore emulator.

## Example

```yaml
name: Build
on:
  pull_request:

jobs:
  test:
    steps:
      - name: Test
        run: npm run test

      - name: firestore coverage report
        uses: SonicGarden/firestore-rules-report-action@v1
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          report-url: 'http://localhost:8080/emulator/v1/projects/<databse_name>:ruleCoverage'
```