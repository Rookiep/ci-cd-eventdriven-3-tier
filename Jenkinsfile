pipeline {
    agent any

    environment {
        DOCKER_IMAGES = "frontend api worker"
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
                    steps {
                        sh 'docker build -t frontend:local frontend'
                    }
                }
                stage('API') {
                    steps {
                        sh 'docker build -t api:local api-server'
                    }
                }
                stage('Worker') {
                    steps {
                        sh 'docker build -t worker:local worker'
                    }
                }
            }
        }

        stage('SonarQube Scan') {
            environment {
                SONAR_TOKEN = credentials('sonar-token')
            }
            steps {
                sh '''
                docker run --rm --network host \
                  -v "$WORKSPACE:/usr/src" \
                  sonarsource/sonar-scanner-cli \
                  -Dsonar.projectKey=ci-cd-event-driven \
                  -Dsonar.sources=/usr/src \
                  -Dsonar.host.url=http://localhost:9000 \
                  -Dsonar.login=$SONAR_TOKEN
                '''
            }
        }

        stage('OWASP Dependency Check') {
            steps {
                dependencyCheck(
                    odcInstallation: 'Default',
                    additionalArguments: '--scan . --failOnCVSS 7',
                    stopBuild: true
                )
            }
        }

       stage('Trivy Image Scan') {
    steps {
        script {
            for (img in DOCKER_IMAGES.split()) {
                sh """
                docker run --rm \
                  -v /var/run/docker.sock:/var/run/docker.sock \
                  aquasec/trivy:latest \
                  image --severity HIGH,CRITICAL ${img}:local || true
                """
            }
        }
    }
}

    } // <-- closes the stages block

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