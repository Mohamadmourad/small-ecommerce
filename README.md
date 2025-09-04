# small-ecommerce — Local run guide

Short plan: This README explains how to run the server, web client, and mobile app locally on Windows, plus how to run Kafka and Postgres for development.

Checklist
- Ensure Postgres is available and configured (local or external)
- Start Kafka + Zookeeper (Docker Compose recommended)
- Build & run Spring Boot server (`server`)
- Start Next.js web client (`client/web`)
- Start Flutter mobile app (`client/mobile`)

Prerequisites
- Java (for server)
- Node.js and npm (for web client)
- Flutter SDK (for mobile)
- Docker & Docker Compose (recommended for Kafka + Zookeeper)

Repository layout (relevant folders)
- `server/` — Spring Boot application 
- `client/web/` — Next.js web client
- `client/mobile/` — Flutter mobile app

1) Start Kafka + Zookeeper (Docker Compose)

Minimal `docker-compose.yml` (create locally):

```yaml
version: '3.8'
services:
  zookeeper:
    image: confluentinc/cp-zookeeper:7.4.0
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
    ports:
      - "2181:2181"

  kafka:
    image: confluentinc/cp-kafka:7.4.0
    depends_on:
      - zookeeper
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: PLAINTEXT:PLAINTEXT
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://localhost:9092
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
    ports:
      - "9092:9092"
```

Start it:

```powershell
# from the folder that contains docker-compose.yml
docker compose up -d
# or
docker-compose up -d
```

Verify containers are running:

```powershell
docker ps
```

Create topics:

```powershell
# replace <kafka_container_name> with the name from `docker ps`
docker exec -it <kafka_container_name> kafka-topics --create --topic orders.created --bootstrap-server localhost:9092 --partitions 1 --replication-factor 1

docker exec -it <kafka_container_name> kafka-topics --create --topic products.low-stock --bootstrap-server localhost:9092 --partitions 1 --replication-factor 1
```

2) Build & run the Spring Boot server

Open cmd in the `server` folder:

```cmd
cd "c:\Users\we\Desktop\ecommece website\server"
mvn -DskipTests package
# then run the jar
java -jar target\small-ecommerce-0.0.1-SNAPSHOT.jar
# (dev) or
mvn spring-boot:run
```

Important properties (see `server/src/main/resources/application.properties`):

```
kafka.bootstrap.servers=localhost:9092
spring.datasource.url=jdbc:postgresql://localhost:5432/small-ecommerce
spring.datasource.username=postgres
spring.datasource.password=admin
```

4) Start the Next.js web client

Open a new terminal in `client/web`:

```cmd
cd "c:\Users\we\Desktop\ecommece website\client\web"
npm install
npm run dev
# Next dev server will run on http://localhost:3000
```

5) Start the Flutter mobile app

Open a terminal in `client/mobile`:

```powershell
cd "c:\Users\we\Desktop\ecommece website\client\mobile"
flutter pub get
flutter run -d chrome
# or run on Android/iOS device/emulator
flutter run
```

6) Verify Kafka messages

Open a separate terminal and run a console consumer:

```powershell
docker exec -it <kafka_container_name> kafka-console-consumer --topic orders.created --bootstrap-server localhost:9092 --from-beginning

docker exec -it <kafka_container_name> kafka-console-consumer --topic products.low-stock --bootstrap-server localhost:9092 --from-beginning
```

Alternatively, run the Spring Boot app and check logs — `KafkaProducerService` prints send logs.

Notes: 
- I did not implement a payment gateway (stripe, wish...) i assumed that the order will be automatically set as paid
- the admin account get automatically created on stratup with email admin@gmail.com and password as you set it in the application.properties
