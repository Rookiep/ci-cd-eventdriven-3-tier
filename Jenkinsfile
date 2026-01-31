pipeline {
    agent any

    environment {
        DOCKER_IMAGES = "frontend api worker"
        SONAR_HOST = "http://localhost:9000"
        SONAR_LOGIN = "admin"
        DC_DATA = "${WORKSPACE}/dependency-check-data"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Images') {
            parallel {
                stage('Frontend') {
                    steps { sh 'docker build -t frontend:local frontend' }
                }
                stage('API') {
                    steps { sh 'docker build -t api:local api-server' }
                }
                stage('Worker') {
                    steps { sh 'docker build -t worker:local worker' }
                }
            }
        }

        stage('SonarQube Scan') {
            steps {
                sh '''
                docker rm -f sonarqube || true
                docker run -d --name sonarqube -p 9000:9000 sonarqube:lts
                echo "Waiting for SonarQube..."
                sleep 60

                sonar-scanner \
                  -Dsonar.projectKey=ci-cd-event-driven \
                  -Dsonar.sources=. \
                  -Dsonar.host.url=$SONAR_HOST \
                  -Dsonar.login=$SONAR_LOGIN
                '''
            }
        }

        stage('Quality Gate') {
            steps {
                script {
                    timeout(time: 5, unit: 'MINUTES') {
                        def qg = waitForQualityGate()
                        if (qg.status != 'OK') {
                            error "❌ SonarQube Quality Gate failed"
                        }
                    }
                }
            }
        }

        stage('OWASP Dependency Check') {
            steps {
                sh '''
                mkdir -p ${DC_DATA}

                docker run --rm \
                  -v ${WORKSPACE}:/src \
                  -v ${DC_DATA}:/usr/share/dependency-check/data \
                  owasp/dependency-check:latest \
                  --scan /src \
                  --format "HTML" \
                  --out /src/dependency-check-report \
                  --failOnCVSS 7
                '''
            }
        }

        stage('Trivy Image Scan') {
            steps {
                script {
                    for (img in DOCKER_IMAGES.split()) {
                        sh "trivy image --exit-code 1 --severity HIGH,CRITICAL ${img}:local"
                    }
                }
            }
        }

        stage('Run Local App (Optional)') {
            steps {
                sh 'docker-compose up -d --build'
                sleep 10
            }
        }
    }

    post {
        always {
            sh 'docker-compose down || true'
            archiveArtifacts artifacts: 'dependency-check-report/**', allowEmptyArchive: true
        }
        failure {
            echo '❌ Pipeline failed. Check security or quality reports.'
        }
        success {
            echo '✅ Pipeline completed successfully.'
        }
    }
}