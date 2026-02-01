# 🚀 Event-Driven 3-Tier CI/CD DevSecOps Architecture This repository demonstrates a **production-style, end-to-end DevSecOps CI/CD pipeline** for an **event-driven 3-tier microservices application**, built using **Jenkins, Docker, Helm, Argo CD (GitOps), Kubernetes, RabbitMQ, Redis, and full observability**. It is designed as a **real-world learning + portfolio project**, showcasing how modern DevOps teams build, secure, deploy, scale, and monitor distributed systems. --- ## 📐 High-Level Architecture ### CI/CD + Runtime Architecture **Flow:**
Developer → GitHub → Jenkins CI → Security & Quality Gates → Docker → GitHub
                                             ↓
                                      Helm Charts
                                             ↓
                                      Argo CD (GitOps)
                                             ↓
                                      Kubernetes Cluster
### Runtime (Event-Driven)
Frontend → API Server → RabbitMQ → Worker
                ↓
              Redis
Monitoring & Observability: * Prometheus * Grafana > Kubernetes runs locally using **Docker Desktop Kubernetes**. --- ## 🧱 Technology Stack ### CI / CD & GitOps * **GitHub** – Source control * **Jenkins** – CI & CD pipelines * **Helm** – Kubernetes packaging * **Argo CD** – GitOps continuous deployment ### DevSecOps * **OWASP Dependency Check** – Dependency vulnerability scan * **SonarQube** – Code quality & security gates * **Trivy** – Filesystem & container image scanning ### Application & Messaging * **Frontend** – Web UI * **API Server** – REST API (Flask / Node style) * **RabbitMQ** – Event broker * **Worker** – Background job processor * **Redis** – Caching / fast reads ### Platform & Observability * **Docker & Docker Compose** – Local development * **Kubernetes** – Container orchestration * **Prometheus** – Metrics * **Grafana** – Dashboards * **KEDA** – Event-driven autoscaling (RabbitMQ-based) --- ## 📁 Repository Structure
bash
ci-cd-eventdriven-3-tier/
├── api-server/            # Backend API
├── frontend/              # Frontend UI
├── worker/                # Background worker
├── docker-compose.yml     # Local container setup
│
├── helm-charts/           # Helm charts for Kubernetes
│   ├── api/
│   ├── frontend/
│   ├── worker/
│   ├── rabbitmq/
│   └── redis/
│
│
├── promethues/         # Prometheus & Grafana configs
│   ├── prometheus.yaml
│  
│
├── Jenkinsfile            # Jenkins CI/CD pipeline
└── README.md
--- ## 🔁 CI Pipeline (Jenkins) ### Jenkins CI Job 1. Pull code from GitHub 2. Install dependencies 3. Run **OWASP Dependency Check** 4. Run **SonarQube analysis & quality gate** 5. Run **Trivy filesystem scan** 6. Build Docker images 7. Push images to registry ### Jenkins CD Job 1. Update Helm chart values (image tags) 2. Commit Helm changes to GitHub 3. Trigger **Argo CD sync** automatically --- ## 🚀 GitOps Deployment (Argo CD) * Argo CD continuously watches Helm charts in GitHub * Any change to helm-charts/** is automatically applied * Drift detection and self-healing enabled
yaml
syncPolicy:
  automated:
    prune: true
    selfHeal: true
No manual kubectl apply is used in production flow. --- ## 📦 Local Development (Docker Compose) ### Start all services locally
bash
docker compose up -d --build
### Access | Service | URL | | ----------- | ------------------------------------------------ | | Frontend | [http://localhost:8081](http://localhost:8081) | | API | [http://localhost:5000](http://localhost:5000) | | RabbitMQ UI | [http://localhost:15672](http://localhost:15672) | | Redis | localhost:6379 | RabbitMQ credentials:
username: guest
password: guest
--- ## ☸️ Kubernetes Deployment (Helm + Argo CD) ### Install Argo CD
bash
kubectl create namespace argocd
kubectl apply -n argocd \
  -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
### Apply Applications
bash
kubectl apply -f argocd/
### View Applications
bash
kubectl get applications -n argocd
--- ## 📈 Autoscaling with KEDA * Worker pods scale based on **RabbitMQ queue depth** * KEDA monitors messages_ready
yaml
triggers:
  - type: rabbitmq
    metadata:
      queueName: task-queue
      queueLength: "10"
Flooding the queue triggers horizontal scaling automatically. --- ## 📊 Observability ### Metrics * RabbitMQ metrics * Node / Pod metrics * Application metrics ### Dashboards * Queue depth * Worker scaling * API latency * Pod & node health Powered by **Prometheus + Grafana**. --- ## 🎯 Learning Outcomes This project demonstrates: * Real-world CI/CD pipelines * DevSecOps best practices * GitOps with Helm & Argo CD * Event-driven microservices * Kubernetes autoscaling with KEDA * Full observability stack --- ## 🧠 Interview-Ready Summary > “I built a complete event-driven DevSecOps CI/CD system using Jenkins for CI, Helm for packaging, Argo CD for GitOps-based CD, RabbitMQ for messaging, KEDA for autoscaling, and Prometheus/Grafana for observability — all deployed on Kubernetes.” --- ## 📌 Future Enhancements * Secrets management (Vault / SealedSecrets) * Canary & blue-green deployments * Argo CD Image Updater * Multi-environment GitOps (dev/stage/prod) * Chaos engineering --- ## ⭐ If you found this useful Give the repo a ⭐ and feel free to fork & experiment! rewrite the readme as per the actual repo from the screenshot
