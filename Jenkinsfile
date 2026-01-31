pipeline {
    agent any
    environment {
        DOCKER_IMAGES = "frontend api worker"
        SONAR_HOST = "http://localhost:9000"
        SONAR_LOGIN = "admin"
    }
    stages {
        stage('Checkout') { steps { checkout scm } }
        stage('Build Docker Images') {
            steps {
                script {
                    for (img in DOCKER_IMAGES.split()) {
                        sh "docker build -t ${img}:local ${img}"
                    }
                }
            }
        }
        stage('SonarQube Scan') {
            steps {
                sh '''
                docker rm -f sonarqube || true
                docker run -d --name sonarqube -p 9000:9000 sonarqube:lts
                sleep 60
                sonar-scanner                   -Dsonar.projectKey=ci-cd-event-driven                   -Dsonar.sources=.                   -Dsonar.host.url=$SONAR_HOST                   -Dsonar.login=$SONAR_LOGIN
                '''
            }
        }
        stage('Quality Gate') {
            steps {
                script {
                    def qg = waitForQualityGate()
                    if (qg.status != 'OK') { error "Quality gate failed" }
                }
            }
        }
        stage('Trivy Scan') {
            steps {
                script {
                    for (img in DOCKER_IMAGES.split()) {
                        sh "trivy image --exit-code 1 --severity HIGH,CRITICAL ${img}:local"
                    }
                }
            }
        }
        stage('Run Local App (Optional)') {
            steps { sh 'docker-compose up -d --build' }
        }
    }
    post { always { sh 'docker-compose down || true' } }
}
