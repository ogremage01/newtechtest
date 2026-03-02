plugins {
    java
    id("org.springframework.boot") version "4.0.3"
    id("io.spring.dependency-management") version "1.1.7"
}

group = "com.shop"
version = "0.1.0"

java {
    sourceCompatibility = JavaVersion.VERSION_17
}

repositories {
    mavenCentral()
}

// CVE 대응: Jackson core 수정 버전 고정 (GHSA-72hv-8253-57qq 등)
configurations.all {
    resolutionStrategy.eachDependency {
        if (requested.group == "tools.jackson.core" && requested.name == "jackson-core") {
            useVersion("3.1.0")
            because("GHSA-72hv-8253-57qq")
        }
        if (requested.group == "com.fasterxml.jackson.core" && requested.name == "jackson-core") {
            useVersion("2.21.1")
            because("CVE jackson-core 2.x")
        }
    }
}

dependencies {
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-security")
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.springframework.boot:spring-boot-starter-validation")
    runtimeOnly("org.mariadb.jdbc:mariadb-java-client")
    runtimeOnly("com.h2database:h2")
    implementation("io.jsonwebtoken:jjwt-api:0.13.0")
    runtimeOnly("io.jsonwebtoken:jjwt-impl:0.13.0")
    runtimeOnly("io.jsonwebtoken:jjwt-jackson:0.13.0")
    compileOnly("org.projectlombok:lombok")
    annotationProcessor("org.projectlombok:lombok")
    testImplementation("org.springframework.boot:spring-boot-starter-security-test")
    testImplementation("org.springframework.boot:spring-boot-starter-webmvc-test")
    testImplementation("org.springframework.boot:spring-boot-jackson2")
}

tasks.withType<Test> {
    useJUnitPlatform()
}
