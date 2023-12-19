# BringingHexyBack

## Setting api key

Generate a random key

```sh
API_KEY=$(cat /dev/urandom | head | sha1sum | cut -f1 -d' ')
```

Set the api key

```sh
pnpm sst secrets set API_KEY $API_KEY
```
