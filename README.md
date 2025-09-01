[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FIndustryFusion%2Ficidservice-poc.svg?type=shield&issueType=license)](https://app.fossa.com/projects/git%2Bgithub.com%2FIndustryFusion%2Ficidservice-poc?ref=badge_shield&issueType=license)

[![Nigthly](https://github.com/IndustryFusion/icidservice-poc/actions/workflows/nightly.yaml/badge.svg)](https://github.com/IndustryFusion/icidservice-poc/actions/workflows/nightly.yaml)

### ICID Service

The **ICID Service** is part of the [IFRIC](https://ifric.org) ecosystem.  
It provides **unique registration, identification, and certification of Industry Fusion assets** and other digital objects.  

- Designed for **large-scale ecosystems** where billions of objects/products need unique IDs.  
- Helps **reduce counterfeiting and piracy** by providing secure identity assignment.  
- Fully **open source** under Apache 2.0, but also **commercialized by IFRIC** for use in the **IFF ecosystem** [IndustryFusion](https://industry-fusion.com) and other industrial networks.  

---

## 🚀 Features

- 🔑 Unique ID generation & lifecycle management for assets  
- 🌍 Supports IFF and other ecosystems requiring trusted identity  
- 🛡️ Anti-counterfeit & anti-piracy use cases  
- ☁️ Deployable anywhere – **local, Docker, or Kubernetes**  
- 🔗 Provides REST API endpoints for easy integration  

---

## 📦 Project Structure

- **Backend** → NestJS application exposing REST endpoints  
- **Environment Config** → `.env` file with required keys  

---

## 🖥️ Running Locally

1. Clone the repository  
2. Copy `.env.example` → `.env` and configure values  
3. Install dependencies & run backend:  

```bash
cd backend
npm install
npm run start:dev
```

## 🐳 Running with Docker

### Build the Backend Image
```bash
cd backend
docker build -t icidservice/backend:latest .
```

### Run the Container
```bash
docker run --env-file .env -p 4006:4006 icidservice/backend:latest
```

## ☸️ Running with Kubernetes

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: icidservice
spec:
  replicas: 1
  selector:
    matchLabels:
      app: icidservice
  template:
    metadata:
      labels:
        app: icidservice
    spec:
      containers:
        - name: icidservice
          image: icidservice/backend:latest
          ports:
            - containerPort: 4006
          envFrom:
            - secretRef:
                name: icidservice-env
---
apiVersion: v1
kind: Service
metadata:
  name: icidservice
spec:
  type: ClusterIP
  ports:
    - port: 4006
      targetPort: 4006
  selector:
    app: icidservice
```

## 🔌 API Endpoints (Examples)

```http
/asset     # Manages unique identity for assets
/company # Manages unique identity for companies
/contract # Manages unique identity for companies
/gateway # Manages unique identity for companies
/user # Manages unique identity for companies
```

