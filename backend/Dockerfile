# -------------------------
# Stage 1: Build application
# -------------------------
FROM maven:3.9.9-eclipse-temurin-21 AS build

WORKDIR /app

# Copy Maven configuration first for better build caching
COPY pom.xml .
COPY .mvn .mvn
COPY mvnw .

RUN chmod +x mvnw

# Download dependencies
RUN ./mvnw dependency:go-offline -B

# Copy application source
COPY src ./src

# Build Spring Boot application
RUN ./mvnw clean package -DskipTests -B


# -------------------------
# Stage 2: Run application
# -------------------------
FROM eclipse-temurin:21-jre

WORKDIR /app

# Copy the generated JAR
COPY --from=build /app/target/*.jar app.jar

# Render provides the PORT environment variable
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
