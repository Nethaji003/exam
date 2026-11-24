# Multi-stage Dockerfile for ExamPrep AI Spring Boot Backend
# Optimized for Render deployment using Java 17

# ── Stage 1: Build JAR with Maven & Eclipse Temurin JDK 17 ──
FROM maven:3.9.6-eclipse-temurin-17 AS builder
WORKDIR /app
COPY settings.xml /root/.m2/settings.xml
# Copy project files
COPY pom.xml .
COPY src ./src

# Build application package
# Notice: 'mvn dependency:go-offline' has been removed to avoid Maven Central HTTP 429 rate-limiting on shared cloud build runners.
# Configured with Wagon HTTP retry handler and connection timeout flags for robust dependency downloads.
RUN mvn clean package -DskipTests -B --no-transfer-progress \
    -Dmaven.wagon.http.retryHandler.count=5 \
    -Dmaven.wagon.http.retryHandler.requestSentKeepAliveRuntime=true \
    -Dhttp.keepAlive=false \
    -Dmaven.wagon.httpconnectionManager.ttlSeconds=120

# ── Stage 2: Minimal Runtime Container with Eclipse Temurin JRE 17 ──
FROM eclipse-temurin:17-jre
WORKDIR /app

# Run as dedicated non-root user for container security
RUN groupadd -r spring && useradd -r -g spring spring
USER spring:spring

# Copy built JAR from builder stage
COPY --from=builder /app/target/*.jar app.jar

# Render assigns dynamic port via $PORT env var (default fallback: 8080)
ENV PORT=8080
EXPOSE ${PORT}

# Health check on Render & execute application with JVM container support and Render dynamic port
ENTRYPOINT ["sh", "-c", "java -XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -Dserver.port=${PORT} -jar app.jar"]

