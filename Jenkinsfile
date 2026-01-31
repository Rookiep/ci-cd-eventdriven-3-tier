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
        script {
            // Start SonarQube server
            sh 'docker rm -f sonarqube || true'
            sh 'docker run -d --name sonarqube -p 9000:9000 sonarqube:lts'

            echo "Waiting for SonarQube to start..."
            sleep 60

            // Run Sonar Scanner inside Docker
            sh '''
            docker run --rm \
                --network host \
                -v "${WORKSPACE}:/usr/src" \
                sonarsource/sonar-scanner-cli \
                -Dsonar.projectKey=ci-cd-event-driven \
                -Dsonar.sources=/usr/src \
                -Dsonar.host.url=http://host.docker.internal:9000 \
                -Dsonar.login=admin
            '''
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
    }

    post {
        always {
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