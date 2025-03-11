# Shikshav20

## Host App

### test-app

Next JS, run:

```sh
nx dev test-app --port=3000 --verbose
```

Port : `3000`

### teachers

Next JS, run:

```sh
nx dev teachers --port=3001 --verbose
```

### shiksha-app

Next JS, run:

```sh
nx dev shiksha-app --port=3002 --verbose
```

### atree-app

Next JS, run:

```sh
nx dev atree-app --port=3003 --verbose
```

### atree-auth

Next JS, run:

```sh
nx dev atree-auth --port=4120 --verbose
```

##

## Micro Frontend List

### test-next-route

Next JS, run:

```sh
nx dev test-next-route --port=4100 --verbose
```

basePath : `http://localhost:4100/iframenext/`
Port : `4100`

### test-react-vite

Next JS, run:

```sh
nx serve test-react-vite --port=4200 --verbose
```

basePath : `http://localhost:4200/iframereact/`
Port : `4200`

### authentication

Next JS, run:

```sh
nx dev authentication --port=4101 --verbose
```

basePath : `http://localhost:4101/authentication/`
Port : `4101`

### scp-teacher

Next JS, run:

```sh
nx dev scp-teacher --port=4102 --verbose
```

basePath : `http://localhost:4102/scp-teacher/`
Port : `4102`

### youthNet

Next JS, run:

```sh
nx dev youthNet --port=4103 --verbose
```

basePath : `http://localhost:4103/youthnet/`
Port : `4103`

### registration

Next JS, run:

```sh
nx dev registration --port=4104 --verbose
```

basePath : `http://localhost:4104/mfe_registration/`
Port : `4104`

### content

Next JS, run:

```sh
nx dev content --port=4105 --verbose
```

basePath : `http://localhost:4105/mfe_content/`
Port : `4105`

##

## NX Command

### View Nx Graph

` nx graph`

### Build All Project

`npx nx run-many --target=build --all`

### Install NX Globally

`npm install -g nx`

## Notes

## use shared library in any project

```sh
import { SharedLib } from '@shared-lib';
```
