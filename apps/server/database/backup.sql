-- MySQL dump 10.13  Distrib 8.0.39, for Win64 (x86_64)
--
-- Host: localhost    Database: servicio_tecnico
-- ------------------------------------------------------
-- Server version	8.0.39

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `servicio_tecnico`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `servicio_tecnico` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `servicio_tecnico`;

--
-- Table structure for table `bien`
--

DROP TABLE IF EXISTS `bien`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bien` (
  `id` int NOT NULL,
  `nombre` varchar(100) COLLATE utf8mb4_bin NOT NULL,
  `bien_marca_id` int NOT NULL,
  `bien_categoria_id` int NOT NULL,
  `magnitud_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk2` (`bien_marca_id`),
  KEY `fk3` (`bien_categoria_id`),
  KEY `fk4` (`magnitud_id`),
  CONSTRAINT `fk1` FOREIGN KEY (`id`) REFERENCES `elemento_economico` (`id`),
  CONSTRAINT `fk2` FOREIGN KEY (`bien_marca_id`) REFERENCES `bien_marca` (`id`),
  CONSTRAINT `fk3` FOREIGN KEY (`bien_categoria_id`) REFERENCES `bien_categoria` (`id`),
  CONSTRAINT `fk4` FOREIGN KEY (`magnitud_id`) REFERENCES `magnitud` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bien`
--

LOCK TABLES `bien` WRITE;
/*!40000 ALTER TABLE `bien` DISABLE KEYS */;
INSERT INTO `bien` VALUES (1,'Laptop',2,1,1),(2,'Smartphone',2,1,1),(3,'Televisión',3,1,1),(4,'Refrigerador',4,2,1),(5,'Lavadora',4,2,1),(6,'Horno Microondas',1,2,1),(7,'Tablet',2,1,1),(8,'Cámara Fotográfica',3,1,1),(9,'Impresora',5,1,1),(10,'Router',1,1,1),(11,'Máquina Herramienta',1,1,1),(12,'Camión',3,2,1),(13,'Excavadora',4,1,1),(14,'Tractor',2,1,1),(15,'Grúa',3,1,1),(16,'Generador Eléctrico',5,3,1),(17,'Montacargas',1,1,1),(18,'Compresor de Aire',1,1,1),(19,'Transformador',5,3,1),(20,'Bomba Hidráulica',4,1,1);
/*!40000 ALTER TABLE `bien` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bien_capital`
--

DROP TABLE IF EXISTS `bien_capital`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bien_capital` (
  `id` int NOT NULL,
  `f_alta` datetime NOT NULL,
  `f_baja` datetime NOT NULL,
  `valor_inicial` decimal(20,2) NOT NULL DEFAULT '0.00',
  `valor_residual` decimal(20,2) DEFAULT NULL,
  `es_salida` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  CONSTRAINT `fk15` FOREIGN KEY (`id`) REFERENCES `bien` (`id`),
  CONSTRAINT `bien_capital_chk_1` CHECK ((`es_salida` in (0,1)))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bien_capital`
--

LOCK TABLES `bien_capital` WRITE;
/*!40000 ALTER TABLE `bien_capital` DISABLE KEYS */;
INSERT INTO `bien_capital` VALUES (11,'2024-01-01 10:00:00','2025-01-01 10:00:00',10000.00,5000.00,1),(12,'2023-06-15 14:30:00','2024-06-15 14:30:00',15000.00,7500.00,0),(13,'2022-09-20 09:45:00','2023-09-20 09:45:00',20000.00,10000.00,1),(14,'2021-12-01 12:00:00','2022-12-01 12:00:00',12000.00,6000.00,1),(15,'2024-03-25 08:15:00','2025-03-25 08:15:00',18000.00,9000.00,0),(16,'2023-07-10 11:30:00','2024-07-10 11:30:00',14000.00,7000.00,1),(17,'2022-05-05 15:00:00','2023-05-05 15:00:00',13000.00,6500.00,0),(18,'2021-11-11 13:45:00','2022-11-11 13:45:00',17000.00,8500.00,1),(19,'2024-02-20 07:30:00','2025-02-20 07:30:00',16000.00,8000.00,1),(20,'2023-08-18 10:15:00','2024-08-18 10:15:00',11000.00,5500.00,0);
/*!40000 ALTER TABLE `bien_capital` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bien_categoria`
--

DROP TABLE IF EXISTS `bien_categoria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bien_categoria` (
  `id` int NOT NULL,
  `nombre` varchar(100) COLLATE utf8mb4_bin NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bien_categoria`
--

LOCK TABLES `bien_categoria` WRITE;
/*!40000 ALTER TABLE `bien_categoria` DISABLE KEYS */;
INSERT INTO `bien_categoria` VALUES (1,'Celular'),(2,'Equipos'),(5,'Equipos Eléctricos'),(3,'Maquinaria Pesada'),(4,'Vehículos de Transporte');
/*!40000 ALTER TABLE `bien_categoria` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bien_marca`
--

DROP TABLE IF EXISTS `bien_marca`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bien_marca` (
  `id` int NOT NULL,
  `nombre` varchar(100) COLLATE utf8mb4_bin NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bien_marca`
--

LOCK TABLES `bien_marca` WRITE;
/*!40000 ALTER TABLE `bien_marca` DISABLE KEYS */;
INSERT INTO `bien_marca` VALUES (2,'Apple'),(6,'Caterpillar'),(5,'HP'),(7,'John Deere'),(9,'Komatsu'),(4,'LG'),(1,'Samsung'),(10,'Siemens'),(3,'Sony'),(8,'Volvo');
/*!40000 ALTER TABLE `bien_marca` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `calidad`
--

DROP TABLE IF EXISTS `calidad`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `calidad` (
  `id` int NOT NULL,
  `nombre` varchar(100) COLLATE utf8mb4_bin NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `calidad`
--

LOCK TABLES `calidad` WRITE;
/*!40000 ALTER TABLE `calidad` DISABLE KEYS */;
INSERT INTO `calidad` VALUES (2,'Copia'),(1,'Original');
/*!40000 ALTER TABLE `calidad` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `carpeta`
--

DROP TABLE IF EXISTS `carpeta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carpeta` (
  `id` int NOT NULL,
  `nombre` varchar(100) COLLATE utf8mb4_bin NOT NULL,
  `f_creacion` datetime NOT NULL,
  `usuario_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk68` (`usuario_id`),
  CONSTRAINT `fk68` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carpeta`
--

LOCK TABLES `carpeta` WRITE;
/*!40000 ALTER TABLE `carpeta` DISABLE KEYS */;
/*!40000 ALTER TABLE `carpeta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cliente`
--

DROP TABLE IF EXISTS `cliente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cliente` (
  `id` int NOT NULL,
  `documento_identificacion_id` int NOT NULL,
  `codigo` varchar(50) COLLATE utf8mb4_bin NOT NULL,
  `nombre` varchar(100) COLLATE utf8mb4_bin NOT NULL,
  `apellido` varchar(100) COLLATE utf8mb4_bin NOT NULL,
  `genero_id` int NOT NULL,
  `celular` bigint DEFAULT NULL,
  `celular_respaldo` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk27` (`documento_identificacion_id`),
  KEY `fk28` (`genero_id`),
  CONSTRAINT `fk27` FOREIGN KEY (`documento_identificacion_id`) REFERENCES `documento_identificacion` (`id`),
  CONSTRAINT `fk28` FOREIGN KEY (`genero_id`) REFERENCES `genero` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cliente`
--

LOCK TABLES `cliente` WRITE;
/*!40000 ALTER TABLE `cliente` DISABLE KEYS */;
INSERT INTO `cliente` VALUES (1,1,'C001','Juan','Pérez',1,987654321,912345678),(2,1,'C002','María','García',2,987654321,912345678),(3,1,'C003','Carlos','López',1,987654321,912345678),(4,1,'C004','Ana','Martínez',2,987654321,912345678),(5,1,'C005','Luis','Rodríguez',1,51987654321,912345678),(6,2,'C006','Sofía','Gómez',2,987654321,912345678),(7,1,'C007','Miguel','Hernández',1,987654321,912345678),(8,1,'C008','Laura','Díaz',2,987654321,912345678),(9,1,'C009','José','Fernández',1,987654321,912345678),(10,1,'C010','Elena','Ramírez',2,987654321,912345678),(13,3,'aaaa','aaaa','aaaa',2,NULL,NULL),(14,1,'bbbBBB','bbb','bbb',1,NULL,NULL),(15,3,'ccc','ccc','cc',2,NULL,NULL),(16,1,'79','789','789',2,NULL,NULL),(17,2,'xx','xx','xx',1,NULL,NULL),(18,2,'aaa','aa','aa',1,NULL,NULL),(19,3,'yyy','yyyy','yyy',2,NULL,NULL),(20,3,'111','11','11',1,NULL,NULL),(21,3,'22','22','22',2,NULL,NULL),(22,3,'223','333','333·33',2,NULL,NULL),(23,1,'123','123','123',1,NULL,NULL),(24,3,'123','123','123',1,NULL,NULL),(25,3,'555','55','55',1,NULL,NULL),(26,3,'123','123','123',2,NULL,NULL),(27,3,'333','333','333',2,NULL,NULL),(28,3,'123','123','123',1,NULL,NULL),(29,3,'123','123','123',2,NULL,NULL),(30,1,'1111','333','33',1,NULL,NULL),(31,1,'00','00','00',2,123,NULL);
/*!40000 ALTER TABLE `cliente` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comprobante_externo`
--

DROP TABLE IF EXISTS `comprobante_externo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comprobante_externo` (
  `id` int NOT NULL,
  `comprobante_tipo_id` int DEFAULT NULL,
  `cod_externo_serie` varchar(50) COLLATE utf8mb4_bin DEFAULT NULL,
  `cod_externo_numero` int DEFAULT NULL,
  `emisor_documento_identificacion_id` int DEFAULT NULL,
  `emisor_cod` varchar(50) COLLATE utf8mb4_bin DEFAULT NULL,
  `emisor_nombre` varchar(100) COLLATE utf8mb4_bin DEFAULT NULL,
  `emisor_celular` bigint DEFAULT NULL,
  `liquidacion_tipo_id` int NOT NULL,
  `importe_anticipo` decimal(20,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`id`),
  KEY `fk17` (`comprobante_tipo_id`),
  KEY `fk18` (`emisor_documento_identificacion_id`),
  KEY `fk19` (`liquidacion_tipo_id`),
  CONSTRAINT `fk16` FOREIGN KEY (`id`) REFERENCES `documento_transaccion` (`id`),
  CONSTRAINT `fk17` FOREIGN KEY (`comprobante_tipo_id`) REFERENCES `comprobante_tipo` (`id`),
  CONSTRAINT `fk18` FOREIGN KEY (`emisor_documento_identificacion_id`) REFERENCES `documento_identificacion` (`id`),
  CONSTRAINT `fk19` FOREIGN KEY (`liquidacion_tipo_id`) REFERENCES `liquidacion_tipo` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comprobante_externo`
--

LOCK TABLES `comprobante_externo` WRITE;
/*!40000 ALTER TABLE `comprobante_externo` DISABLE KEYS */;
/*!40000 ALTER TABLE `comprobante_externo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comprobante_externo_credito`
--

DROP TABLE IF EXISTS `comprobante_externo_credito`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comprobante_externo_credito` (
  `id` int NOT NULL,
  `comprobante_externo_id` int NOT NULL,
  `tasa_interes_diario` decimal(20,2) NOT NULL DEFAULT '0.00',
  `importe_capital_inicial` decimal(20,2) NOT NULL DEFAULT '0.00',
  `importe_interes` decimal(20,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`id`),
  UNIQUE KEY `comprobante_externo_id` (`comprobante_externo_id`),
  CONSTRAINT `fk66` FOREIGN KEY (`comprobante_externo_id`) REFERENCES `comprobante_externo` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comprobante_externo_credito`
--

LOCK TABLES `comprobante_externo_credito` WRITE;
/*!40000 ALTER TABLE `comprobante_externo_credito` DISABLE KEYS */;
/*!40000 ALTER TABLE `comprobante_externo_credito` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comprobante_externo_cuota`
--

DROP TABLE IF EXISTS `comprobante_externo_cuota`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comprobante_externo_cuota` (
  `id` int NOT NULL,
  `comprobante_externo_credito_id` int NOT NULL,
  `numero` int NOT NULL DEFAULT '0',
  `f_inicio` datetime DEFAULT NULL,
  `f_vencimiento` datetime DEFAULT NULL,
  `cuota` decimal(20,2) NOT NULL DEFAULT '0.00',
  `amortizacion` decimal(20,2) NOT NULL DEFAULT '0.00',
  `interes` decimal(20,2) NOT NULL DEFAULT '0.00',
  `saldo` decimal(20,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`id`),
  KEY `fk67` (`comprobante_externo_credito_id`),
  CONSTRAINT `fk67` FOREIGN KEY (`comprobante_externo_credito_id`) REFERENCES `comprobante_externo_credito` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comprobante_externo_cuota`
--

LOCK TABLES `comprobante_externo_cuota` WRITE;
/*!40000 ALTER TABLE `comprobante_externo_cuota` DISABLE KEYS */;
/*!40000 ALTER TABLE `comprobante_externo_cuota` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comprobante_externo_detalle`
--

DROP TABLE IF EXISTS `comprobante_externo_detalle`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comprobante_externo_detalle` (
  `id` int NOT NULL,
  `comprobante_externo_id` int NOT NULL,
  `elemento_economico_id` int DEFAULT NULL,
  `concepto` varchar(200) COLLATE utf8mb4_bin DEFAULT NULL,
  `cant` decimal(20,2) NOT NULL DEFAULT '0.00',
  `precio_uni` decimal(20,2) NOT NULL DEFAULT '0.00',
  `descuento` decimal(20,2) NOT NULL DEFAULT '0.00',
  `comentario` varchar(200) COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk23` (`comprobante_externo_id`),
  KEY `fk24` (`elemento_economico_id`),
  CONSTRAINT `fk23` FOREIGN KEY (`comprobante_externo_id`) REFERENCES `comprobante_externo` (`id`),
  CONSTRAINT `fk24` FOREIGN KEY (`elemento_economico_id`) REFERENCES `elemento_economico` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comprobante_externo_detalle`
--

LOCK TABLES `comprobante_externo_detalle` WRITE;
/*!40000 ALTER TABLE `comprobante_externo_detalle` DISABLE KEYS */;
/*!40000 ALTER TABLE `comprobante_externo_detalle` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comprobante_tipo`
--

DROP TABLE IF EXISTS `comprobante_tipo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comprobante_tipo` (
  `id` int NOT NULL,
  `nombre` varchar(100) COLLATE utf8mb4_bin NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comprobante_tipo`
--

LOCK TABLES `comprobante_tipo` WRITE;
/*!40000 ALTER TABLE `comprobante_tipo` DISABLE KEYS */;
/*!40000 ALTER TABLE `comprobante_tipo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `credito_cobrar`
--

DROP TABLE IF EXISTS `credito_cobrar`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `credito_cobrar` (
  `id` int NOT NULL,
  `cliente_id` int DEFAULT NULL,
  `receptor_documento_identificacion_id` int DEFAULT NULL,
  `receptor_cod` varchar(50) COLLATE utf8mb4_bin DEFAULT NULL,
  `receptor_nombre` varchar(100) COLLATE utf8mb4_bin DEFAULT NULL,
  `receptor_celular` bigint DEFAULT NULL,
  `tasa_interes_diario` decimal(20,2) DEFAULT NULL,
  `importe_capital_inicial` decimal(20,2) NOT NULL DEFAULT '0.00',
  `importe_interes` decimal(20,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`id`),
  KEY `fk42` (`cliente_id`),
  KEY `fk43` (`receptor_documento_identificacion_id`),
  CONSTRAINT `fk41` FOREIGN KEY (`id`) REFERENCES `documento_transaccion` (`id`),
  CONSTRAINT `fk42` FOREIGN KEY (`cliente_id`) REFERENCES `cliente` (`id`),
  CONSTRAINT `fk43` FOREIGN KEY (`receptor_documento_identificacion_id`) REFERENCES `documento_identificacion` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `credito_cobrar`
--

LOCK TABLES `credito_cobrar` WRITE;
/*!40000 ALTER TABLE `credito_cobrar` DISABLE KEYS */;
/*!40000 ALTER TABLE `credito_cobrar` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `credito_pagar`
--

DROP TABLE IF EXISTS `credito_pagar`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `credito_pagar` (
  `id` int NOT NULL,
  `cod_externo_serie` varchar(50) COLLATE utf8mb4_bin DEFAULT NULL,
  `cod_externo_numero` int DEFAULT NULL,
  `emisor_documento_identificacion_id` int DEFAULT NULL,
  `emisor_cod` varchar(50) COLLATE utf8mb4_bin DEFAULT NULL,
  `emisor_nombre` varchar(100) COLLATE utf8mb4_bin DEFAULT NULL,
  `emisor_celular` bigint DEFAULT NULL,
  `tasa_interes_diario` decimal(20,2) NOT NULL DEFAULT '0.00',
  `importe_capital_inicial` decimal(20,2) NOT NULL DEFAULT '0.00',
  `importe_interes` decimal(20,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`id`),
  KEY `fk57` (`emisor_documento_identificacion_id`),
  CONSTRAINT `fk56` FOREIGN KEY (`id`) REFERENCES `documento_transaccion` (`id`),
  CONSTRAINT `fk57` FOREIGN KEY (`emisor_documento_identificacion_id`) REFERENCES `documento_identificacion` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `credito_pagar`
--

LOCK TABLES `credito_pagar` WRITE;
/*!40000 ALTER TABLE `credito_pagar` DISABLE KEYS */;
/*!40000 ALTER TABLE `credito_pagar` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cuota_cobrar`
--

DROP TABLE IF EXISTS `cuota_cobrar`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cuota_cobrar` (
  `id` int NOT NULL,
  `credito_cobrar_id` int NOT NULL,
  `numero` int NOT NULL DEFAULT '0',
  `f_inicio` datetime DEFAULT NULL,
  `f_vencimiento` datetime DEFAULT NULL,
  `cuota` decimal(20,2) NOT NULL DEFAULT '0.00',
  `amortizacion` decimal(20,2) NOT NULL DEFAULT '0.00',
  `interes` decimal(20,2) NOT NULL DEFAULT '0.00',
  `saldo` decimal(20,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`id`),
  KEY `fk44` (`credito_cobrar_id`),
  CONSTRAINT `fk44` FOREIGN KEY (`credito_cobrar_id`) REFERENCES `credito_cobrar` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cuota_cobrar`
--

LOCK TABLES `cuota_cobrar` WRITE;
/*!40000 ALTER TABLE `cuota_cobrar` DISABLE KEYS */;
/*!40000 ALTER TABLE `cuota_cobrar` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cuota_pagar`
--

DROP TABLE IF EXISTS `cuota_pagar`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cuota_pagar` (
  `id` int NOT NULL,
  `credito_pagar_id` int NOT NULL,
  `numero` int NOT NULL DEFAULT '0',
  `f_inicio` datetime DEFAULT NULL,
  `f_vencimiento` datetime DEFAULT NULL,
  `cuota` decimal(20,2) NOT NULL DEFAULT '0.00',
  `amortizacion` decimal(20,2) NOT NULL DEFAULT '0.00',
  `interes` decimal(20,2) NOT NULL DEFAULT '0.00',
  `saldo` decimal(20,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`id`),
  KEY `fk58` (`credito_pagar_id`),
  CONSTRAINT `fk58` FOREIGN KEY (`credito_pagar_id`) REFERENCES `credito_pagar` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cuota_pagar`
--

LOCK TABLES `cuota_pagar` WRITE;
/*!40000 ALTER TABLE `cuota_pagar` DISABLE KEYS */;
/*!40000 ALTER TABLE `cuota_pagar` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `documento_identificacion`
--

DROP TABLE IF EXISTS `documento_identificacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `documento_identificacion` (
  `id` int NOT NULL,
  `nombre` varchar(100) COLLATE utf8mb4_bin NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `documento_identificacion`
--

LOCK TABLES `documento_identificacion` WRITE;
/*!40000 ALTER TABLE `documento_identificacion` DISABLE KEYS */;
INSERT INTO `documento_identificacion` VALUES (3,'CARNET DE EXTRANJERIA'),(1,'DNI'),(2,'RUC');
/*!40000 ALTER TABLE `documento_identificacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `documento_movimiento`
--

DROP TABLE IF EXISTS `documento_movimiento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `documento_movimiento` (
  `id` int NOT NULL,
  `uuid` varchar(50) COLLATE utf8mb4_bin NOT NULL,
  `codigo` varchar(50) COLLATE utf8mb4_bin NOT NULL,
  `f_emision` datetime NOT NULL,
  `f_anulacion` datetime DEFAULT NULL,
  `usuario_id` int NOT NULL,
  `concepto` varchar(200) COLLATE utf8mb4_bin DEFAULT NULL,
  `documento_transaccion_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  UNIQUE KEY `codigo` (`codigo`),
  KEY `fk50` (`usuario_id`),
  KEY `fk51` (`documento_transaccion_id`),
  CONSTRAINT `fk50` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`),
  CONSTRAINT `fk51` FOREIGN KEY (`documento_transaccion_id`) REFERENCES `documento_transaccion` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `documento_movimiento`
--

LOCK TABLES `documento_movimiento` WRITE;
/*!40000 ALTER TABLE `documento_movimiento` DISABLE KEYS */;
INSERT INTO `documento_movimiento` VALUES (7,'8228577d-a041-497f-9996-5976e51824f8','MOV-7','2025-01-06 18:11:00',NULL,0,'anticipo',5),(8,'6cccbeb4-9f46-419b-a4bd-b44341686eee','MOV-8','2025-01-06 18:11:00',NULL,0,'vuelto',5),(9,'d9abca89-ab29-48e9-81db-5dcbcd14851b','MOV-9','2025-01-06 18:11:00','2025-01-06 18:18:04',0,'pago',5),(10,'547cae55-f2ec-4fbb-8591-e58b9da8ba83','MOV-10','2025-01-06 18:11:00',NULL,0,NULL,5),(11,'2453eb53-e1f5-4db3-99d5-7abf50a58b64','MOV-11','2025-01-07 14:59:02',NULL,0,'sin transacción',NULL),(12,'972abc0f-86ac-4bfe-a02d-00e8d65cda81','MOV-12','2025-01-07 15:01:34','2025-01-07 15:09:32',0,NULL,6),(13,'96909bad-cd0e-41cc-8293-1320b916e86a','MOV-13','2025-01-07 15:01:51','2025-01-07 15:09:32',0,'vuelto',6),(14,'85fcc751-72f9-463a-8f85-021cfb6b18a9','MOV-14','2025-01-07 15:02:05','2025-01-07 15:05:06',0,'pago',6),(15,'27d3896c-83fd-4a3e-a63a-15610793f01a','MOV-15','2025-01-07 15:07:19','2025-01-07 15:09:32',0,NULL,6),(16,'5f9d7a5e-3e19-4aa3-94b8-516ec37f53eb','MOV-16','2025-01-07 15:10:00','2025-01-09 15:12:00',0,NULL,7),(17,'61980d17-ca12-4881-976d-dbed65bfa660','MOV-17','2025-01-07 15:10:00','2025-01-09 15:12:00',0,'vuelto',7),(18,'5038d185-e706-4592-9095-213b08f6ed19','MOV-18','2025-01-07 16:10:00','2025-01-07 16:12:00',0,'pago',7),(19,'25b6f36a-611f-4820-a016-3e53d9864f21','MOV-19','2025-01-07 15:10:00','2025-01-09 15:12:00',0,NULL,7),(21,'2590c9de-7bc0-4de6-9c16-1f255ff84e5c','MOV-21','2025-01-07 19:27:00',NULL,0,'vuelto',8),(22,'452966d6-115f-4f67-ad46-02661f96a1e9','MOV-22','2025-01-07 19:30:33','2025-01-07 19:30:47',0,'sin anexo',NULL),(23,'e99aadae-e20d-48ca-ade8-40ea1c675bbc','MOV-23','2025-01-07 19:44:30',NULL,0,'retiro',8),(24,'a4a12da9-590a-4baa-833a-28ccc367868c','MOV-24','2025-01-07 19:48:14','2025-01-07 19:48:34',0,'pago',8),(25,'47b77095-f40e-4863-bfc6-1a4d23407f4e','MOV-25','2025-01-07 19:53:57',NULL,0,'ANTICIPO',8),(26,'96b25ecb-fac8-4736-9929-ab5cb436489c','MOV-26','2025-01-07 20:01:03',NULL,0,'anticipo',9),(27,'527ab20d-560b-4544-83c8-2d0434ca54cb','MOV-27','2025-01-07 20:01:13',NULL,0,'vuelto',9),(28,'b6cf23e1-56e3-4d27-a9f9-1454181740e6','MOV-28','2025-01-07 20:01:50',NULL,0,'pago',9),(29,'8aa1c56a-0015-4942-9dad-2dfcb75a8a7e','MOV-29','2025-01-07 20:23:19',NULL,0,'pago 3',5),(30,'f0addd80-db65-4c9e-aef6-65e226c12b95','MOV-30','2025-01-09 16:37:00','2025-01-09 17:01:29',0,'1ra orden',10),(31,'ea61afa7-3346-4923-8769-ca86c1171582','MOV-31','2025-01-09 16:37:00','2025-01-09 19:36:28',0,'1º entrega',10),(32,'4505ea41-625f-4554-8f60-a88a528f3ab7','MOV-32','2025-01-09 16:44:02',NULL,0,'anticipo',10),(33,'9ace1f7d-13eb-4738-99ca-b55824b9c799','MOV-33','2025-01-09 16:44:18',NULL,0,'vuelto',10),(34,'4c4ba2a3-7133-442a-9d2b-f82695d50773','MOV-34','2025-01-09 16:50:06',NULL,0,'1º compra',NULL),(35,'b01d4082-2f4d-46f4-8c0c-8478997588a6','MOV-35','2025-01-09 17:00:50',NULL,0,'2º compra',10),(36,'7916c989-daee-4306-b518-382555f44695','MOV-36','2025-01-09 19:59:00',NULL,0,'anticipo',11),(37,'684014b3-6ac7-48c9-8fe6-fb12289a775b','MOV-37','2025-01-09 19:59:00',NULL,0,'1º compra',11),(38,'6726cd5c-bba2-4d18-b730-8c84514f40c0','MOV-38','2025-01-09 19:59:00',NULL,0,'1º compra',11),(39,'e379342c-2d09-4767-8cad-b4afb9aee174','MOV-39','2025-01-09 20:04:00',NULL,0,'1º entrega',11),(40,'91835df6-3921-4382-8e25-263b817f0bdd','MOV-40','2025-01-09 20:08:15',NULL,0,'inventario inicial',NULL),(41,'1f6a5371-c401-429a-aae0-bbcabc9d49c5','MOV-41','2025-01-09 20:20:17',NULL,0,'INVENTARIO INICIAL',NULL),(42,'bde2a88c-46aa-4be7-a1ab-7bfc154508d8','MOV-42','2025-01-10 02:55:53',NULL,0,'1ra entrega',12),(43,'f938a0dd-da3b-4c2e-9c82-76092f770c4c','MOV-43','2025-01-10 02:56:20',NULL,0,'1ra entrega productos',12),(44,'1d750eb6-33d2-462a-b3ac-11340c2f654f','MOV-44','2025-01-10 02:56:46',NULL,0,'anticipo',12),(45,'41725c74-eae8-4467-93e1-fc6a159b137e','MOV-45','2025-01-10 02:56:57',NULL,0,'vuelto',12),(46,'8ee2c919-c29c-4fdb-be7d-cf33a30b3365','MOV-46','2025-01-10 09:22:00',NULL,0,'anticipo',14),(47,'322bb652-c674-4d36-9b2a-19cc47772acc','MOV-47','2025-01-10 09:22:00',NULL,0,'vuelto',14),(48,'f3a310ef-b010-4bb7-8345-7782bc2a31df','MOV-48','2025-01-10 09:22:00',NULL,0,'1ra entrega',14),(49,'97626691-1712-429b-a225-bee2c8e277c5','MOV-49','2025-01-10 09:22:00',NULL,0,NULL,14),(50,'abf11efc-43c9-4ad3-b6e4-f6eba4b546c6','MOV-50','2025-01-10 09:22:00',NULL,0,'2da entrega',14),(51,'b2e3307a-dc90-4b00-9685-2ed6293f4045','MOV-51','2025-01-11 18:28:42',NULL,0,'2da entrega',14),(52,'38314e98-b141-462c-a54d-b9acc626ede7','MOV-52','2025-01-11 18:29:48',NULL,0,NULL,NULL),(53,'a06c5b8b-1e32-46c8-ba2b-edcc2aad52a9','MOV-53','2025-01-11 18:33:14',NULL,0,NULL,NULL),(54,'d52867ff-b8ad-4416-a5cf-ef32d70e3115','MOV-54','2025-01-08 18:37:00',NULL,0,NULL,NULL),(55,'b5fb3a7b-7868-4de0-862d-6fd93ceb1361','MOV-55','2025-01-12 20:05:38',NULL,0,'inventario inicial',NULL),(56,'3a6c19f2-c592-426a-85c9-211d71553a9e','MOV-56','2025-01-12 20:20:20',NULL,0,'perdio',NULL),(57,'d056e7b1-3543-4146-a26f-3b17bfcdaf52','MOV-57','2025-01-12 20:22:08',NULL,0,NULL,16),(58,'d2a806c2-e8a1-4a96-a8c3-77425878f950','MOV-58','2025-01-12 20:22:57',NULL,0,'1ra entrega',16),(59,'95594787-1ef2-4be7-b1c0-7881e0433df3','MOV-59','2025-01-12 20:24:39',NULL,0,NULL,16),(60,'31897926-0649-4926-8353-29c31895c194','MOV-60','2025-01-12 20:25:42',NULL,0,'2da entrega',16);
/*!40000 ALTER TABLE `documento_movimiento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `documento_transaccion`
--

DROP TABLE IF EXISTS `documento_transaccion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `documento_transaccion` (
  `id` int NOT NULL,
  `uuid` varchar(50) COLLATE utf8mb4_bin NOT NULL,
  `cod_serie` varchar(50) COLLATE utf8mb4_bin DEFAULT NULL,
  `cod_numero` int DEFAULT NULL,
  `f_creacion` datetime NOT NULL,
  `f_actualizacion` datetime NOT NULL,
  `f_emision` datetime DEFAULT NULL,
  `f_anulacion` datetime DEFAULT NULL,
  `usuario_id` int NOT NULL,
  `establecimiento_id` int NOT NULL DEFAULT '1',
  `concepto` varchar(200) COLLATE utf8mb4_bin DEFAULT NULL,
  `carpeta_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  UNIQUE KEY `u1` (`cod_serie`,`cod_numero`),
  KEY `fk20` (`usuario_id`),
  KEY `fk21` (`establecimiento_id`),
  KEY `fk22` (`carpeta_id`),
  CONSTRAINT `fk20` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`),
  CONSTRAINT `fk21` FOREIGN KEY (`establecimiento_id`) REFERENCES `establecimiento` (`id`),
  CONSTRAINT `fk22` FOREIGN KEY (`carpeta_id`) REFERENCES `carpeta` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `documento_transaccion`
--

LOCK TABLES `documento_transaccion` WRITE;
/*!40000 ALTER TABLE `documento_transaccion` DISABLE KEYS */;
INSERT INTO `documento_transaccion` VALUES (5,'d93f7a41-551c-4ae3-a881-34c04cafe4e4','NTDVNT2025',2,'2025-01-06 18:13:49','2025-01-06 18:13:49','2025-01-06 18:11:00',NULL,0,1,NULL,NULL),(6,'90ed39bc-ddb4-4081-a8cc-10d6a9ac7a4a','NTDVNT2025',3,'2025-01-07 15:01:13','2025-01-07 15:09:32','2025-01-07 15:01:23','2025-01-07 15:09:32',0,1,NULL,NULL),(7,'95ad2741-5846-46a8-b064-48a649a60fd1','NTDVNT2025',4,'2025-01-07 15:12:55','2025-01-07 15:12:55','2025-01-07 15:10:00','2025-01-09 15:12:00',0,1,NULL,NULL),(8,'1ec7f8a6-0903-4760-a8b0-2cbcf1c16de8','NTDVNT2025',5,'2025-01-07 19:26:01','2025-01-07 19:27:57','2025-01-07 19:27:00',NULL,0,1,NULL,NULL),(9,'ae56fff5-113e-47ae-9b7b-e0b815ecc75d','NTDVNT2025',6,'2025-01-07 20:00:20','2025-01-07 20:00:52','2025-01-07 20:00:52',NULL,0,1,NULL,NULL),(10,'65a63eed-6f3e-478e-a177-35a9aa09b095','NTDVNT2025',7,'2025-01-09 16:43:22','2025-01-09 16:43:22','2025-01-09 16:37:00',NULL,0,1,NULL,NULL),(11,'6c83c77a-ee6c-4efc-ad02-f0c1a8a36baa','NTDVNT2025',8,'2025-01-09 20:06:59','2025-01-09 20:06:59','2025-01-09 19:59:00',NULL,0,1,NULL,NULL),(12,'295a520e-3565-4cf5-a71c-f282bd6036a6','NTDVNT2025',9,'2025-01-10 02:49:19','2025-01-10 02:49:19','2025-01-10 02:48:00',NULL,0,1,NULL,NULL),(13,'31bd5648-9b77-4ae3-871e-cbfd9b9b59e5','NTDVNT2025',10,'2025-01-10 04:14:38','2025-01-10 04:14:41','2025-01-10 04:14:41',NULL,0,1,NULL,NULL),(14,'feb8a485-cb24-4d8e-8ff4-10b6d1dd0892','NTDVNT2025',11,'2025-01-10 09:18:01','2025-01-10 09:28:05','2025-01-10 09:22:00',NULL,0,1,NULL,NULL),(15,'dc601c36-7582-41b8-9d65-546dcb28cbac',NULL,NULL,'2025-01-10 09:29:21','2025-01-10 09:29:21',NULL,NULL,0,1,NULL,NULL),(16,'e9b28d97-2671-4707-9b45-9aedb3d6ebb4','NTDVNT2025',12,'2025-01-12 20:21:26','2025-01-12 20:21:26','2025-01-12 20:21:26',NULL,0,1,NULL,NULL);
/*!40000 ALTER TABLE `documento_transaccion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `elemento_economico`
--

DROP TABLE IF EXISTS `elemento_economico`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `elemento_economico` (
  `id` int NOT NULL,
  `uuid` varchar(50) COLLATE utf8mb4_bin NOT NULL,
  `codigo` varchar(50) COLLATE utf8mb4_bin NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  UNIQUE KEY `codigo` (`codigo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `elemento_economico`
--

LOCK TABLES `elemento_economico` WRITE;
/*!40000 ALTER TABLE `elemento_economico` DISABLE KEYS */;
INSERT INTO `elemento_economico` VALUES (1,'ec43d6dd-4dbd-4ade-a796-03102f2cb280','PRDCT1'),(2,'ca75841d-8aab-4e0e-9f7a-09cbe512b040','PRDCT2'),(3,'fe669027-7b5d-40ae-a7ea-7b29907559db','PRDCT3'),(4,'47f9de53-36de-486e-aa64-39465eb47391','PRDCT4'),(5,'8f3ae837-dd09-4f28-8391-f920e261b53d','PRDCT5'),(6,'46211642-b35d-466c-80d8-f4ca428b4da8','PRDCT6'),(7,'3e5296f5-8bd2-4fc3-9597-e3dcd68c18f2','PRDCT7'),(8,'4dd16030-321d-4093-b63e-ad08d853bbba','PRDCT8'),(9,'882d20bb-bb5d-4d72-9e74-b8f6740ced33','PRDCT9'),(10,'f6ce37f1-96f1-4973-849f-43e870016dd0','PRDCT10'),(11,'f2e21c31-b5df-4989-a87e-9411271ea156','BNDCPTL11'),(12,'71679482-da8f-4e97-9db3-87a797a81907','BNDCPTL12'),(13,'0f5e7a95-51d5-468b-936b-4ef7d59722fc','BNDCPTL13'),(14,'2d0045a9-1e3a-4415-8cb7-b54a415f1ac1','BNDCPTL14'),(15,'193c47b3-44d9-4c1b-99d2-54cfdf43b196','BNDCPTL15'),(16,'a7d8cceb-6735-41f2-8156-f824facea40a','BNDCPTL16'),(17,'997e0578-3003-4bea-a744-e432c0d81f26','BNDCPTL17'),(18,'00fce283-4d7f-4803-8093-8fe5c09d40fc','BNDCPTL18'),(19,'26e8c4f7-29a1-4072-9e2c-6c7e3b61d09e','BNDCPTL19'),(20,'2c61b471-5382-41d3-802e-5c6df0d604a1','BNDCPTL20'),(21,'e82a1e32-3ae3-40ab-99e9-c61aeb2af9f5','SRVC21'),(22,'106305f3-3aa3-4251-8563-e91dbb9524b5','SRVC22'),(23,'71d2277a-7a08-4135-adf1-1f109de8d353','SRVC23'),(24,'15dc8961-5645-4a7b-ab0e-e8368b55b553','SRVC24'),(25,'64bf39ee-997c-42fd-84f2-9993a997342d','SRVC25'),(26,'1785140d-2bd8-4af5-bf66-3dfe50a5731e','SRVC26'),(27,'3b1358f4-727c-4995-bb41-3eee90a16ee3','SRVC27'),(28,'4b1ed1e9-da53-461a-8781-a38c8172bdae','SRVC28'),(29,'73c00bb3-63de-4087-b221-4157a4b15768','SRVC29'),(30,'482de4da-e3a5-4a34-b263-8a212edbcb3d','SRVC30'),(31,'acf76757-30f4-49f6-b443-76013acca3c5','PNTLL31'),(32,'0a2a08b2-9046-4efc-a562-cbfd25d7a695','PNTLL32'),(33,'b3641cc0-217d-4455-af41-2bec4ffdc688','PNTLL33'),(34,'4c785ca4-c90d-4ff1-b130-b88336a5f795','PNTLL34');
/*!40000 ALTER TABLE `elemento_economico` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `empleado`
--

DROP TABLE IF EXISTS `empleado`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `empleado` (
  `id` int NOT NULL,
  `documento_identificacion_id` int NOT NULL,
  `cod` varchar(50) COLLATE utf8mb4_bin NOT NULL,
  `nombre` varchar(100) COLLATE utf8mb4_bin NOT NULL,
  `apellido` varchar(100) COLLATE utf8mb4_bin NOT NULL,
  `domicilio` varchar(100) COLLATE utf8mb4_bin NOT NULL,
  `genero_id` int NOT NULL,
  `celular` bigint DEFAULT NULL,
  `celular_respaldo` bigint DEFAULT NULL,
  `es_tecnico` int NOT NULL DEFAULT '0',
  `usuario_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `usuario_id` (`usuario_id`),
  KEY `fk71` (`documento_identificacion_id`),
  KEY `fk72` (`genero_id`),
  CONSTRAINT `fk71` FOREIGN KEY (`documento_identificacion_id`) REFERENCES `documento_identificacion` (`id`),
  CONSTRAINT `fk72` FOREIGN KEY (`genero_id`) REFERENCES `genero` (`id`),
  CONSTRAINT `fk73` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`),
  CONSTRAINT `empleado_chk_1` CHECK ((`es_tecnico` in (0,1)))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `empleado`
--

LOCK TABLES `empleado` WRITE;
/*!40000 ALTER TABLE `empleado` DISABLE KEYS */;
INSERT INTO `empleado` VALUES (1,2,'99','andres','mendoza','asd',1,NULL,NULL,0,NULL);
/*!40000 ALTER TABLE `empleado` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `entrada_efectivo`
--

DROP TABLE IF EXISTS `entrada_efectivo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `entrada_efectivo` (
  `id` int NOT NULL,
  `efectivo` decimal(20,2) NOT NULL DEFAULT '0.00',
  `medio_transferencia_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk40` (`medio_transferencia_id`),
  CONSTRAINT `fk39` FOREIGN KEY (`id`) REFERENCES `documento_movimiento` (`id`),
  CONSTRAINT `fk40` FOREIGN KEY (`medio_transferencia_id`) REFERENCES `medio_transferencia` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `entrada_efectivo`
--

LOCK TABLES `entrada_efectivo` WRITE;
/*!40000 ALTER TABLE `entrada_efectivo` DISABLE KEYS */;
INSERT INTO `entrada_efectivo` VALUES (7,50.00,1),(9,30.00,6),(10,20.00,2),(11,50.00,3),(12,50.00,6),(14,30.00,6),(15,20.00,6),(16,50.00,1),(18,30.00,6),(19,20.00,6),(22,5.00,5),(24,150.00,6),(25,50.00,6),(26,50.00,6),(28,499.00,6),(29,45.00,1),(32,50.00,6),(36,50.00,6),(44,50.00,6),(46,50.00,6);
/*!40000 ALTER TABLE `entrada_efectivo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `entrada_pantalla`
--

DROP TABLE IF EXISTS `entrada_pantalla`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `entrada_pantalla` (
  `id` int NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk47` FOREIGN KEY (`id`) REFERENCES `documento_movimiento` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `entrada_pantalla`
--

LOCK TABLES `entrada_pantalla` WRITE;
/*!40000 ALTER TABLE `entrada_pantalla` DISABLE KEYS */;
INSERT INTO `entrada_pantalla` VALUES (30),(34),(35),(37),(41),(49),(52),(55),(57),(59);
/*!40000 ALTER TABLE `entrada_pantalla` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `entrada_pantalla_detalle`
--

DROP TABLE IF EXISTS `entrada_pantalla_detalle`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `entrada_pantalla_detalle` (
  `id` int NOT NULL,
  `entrada_pantalla_id` int NOT NULL,
  `pantalla_modelo_calidad_id` int NOT NULL,
  `cant` decimal(20,2) NOT NULL DEFAULT '0.00',
  `costo_uni` decimal(20,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`id`),
  KEY `fk48` (`entrada_pantalla_id`),
  KEY `fk49` (`pantalla_modelo_calidad_id`),
  CONSTRAINT `fk48` FOREIGN KEY (`entrada_pantalla_id`) REFERENCES `entrada_pantalla` (`id`),
  CONSTRAINT `fk49` FOREIGN KEY (`pantalla_modelo_calidad_id`) REFERENCES `pantalla_modelo_calidad` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `entrada_pantalla_detalle`
--

LOCK TABLES `entrada_pantalla_detalle` WRITE;
/*!40000 ALTER TABLE `entrada_pantalla_detalle` DISABLE KEYS */;
INSERT INTO `entrada_pantalla_detalle` VALUES (1,30,31,1.00,70.00),(2,30,31,5.00,78.00),(3,34,31,1.00,65.00),(4,35,31,1.00,65.00),(5,37,31,1.00,45.00),(6,41,32,11.00,105.00),(7,41,31,3.00,75.00),(8,49,32,2.00,245.00),(9,49,31,2.00,75.00),(10,49,32,4.00,456.00),(11,49,32,4.00,75.00),(12,49,32,1.00,458.00),(13,49,32,2.00,45.00),(14,49,32,2.00,37.00),(15,49,31,1.00,145.00),(16,49,31,2.00,254.00),(17,49,32,3.00,756.00),(18,49,31,2.00,654.00),(19,49,32,2.00,987.00),(20,49,31,1.00,78.00),(21,49,32,4.00,65.00),(22,49,31,1.00,475.00),(23,49,32,3.00,78.00),(24,49,31,1.00,450.00),(25,52,32,2.00,25.06),(26,52,31,3.00,76.21),(27,55,34,6.00,100.00),(28,55,33,14.00,80.00),(29,57,33,3.00,75.00),(30,59,33,5.00,68.00);
/*!40000 ALTER TABLE `entrada_pantalla_detalle` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `entrada_producto`
--

DROP TABLE IF EXISTS `entrada_producto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `entrada_producto` (
  `id` int NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk26` FOREIGN KEY (`id`) REFERENCES `documento_movimiento` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `entrada_producto`
--

LOCK TABLES `entrada_producto` WRITE;
/*!40000 ALTER TABLE `entrada_producto` DISABLE KEYS */;
INSERT INTO `entrada_producto` VALUES (38),(40);
/*!40000 ALTER TABLE `entrada_producto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `entrada_producto_detalle`
--

DROP TABLE IF EXISTS `entrada_producto_detalle`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `entrada_producto_detalle` (
  `id` int NOT NULL,
  `entrada_producto_id` int NOT NULL,
  `producto_id` int NOT NULL,
  `cant` decimal(20,2) NOT NULL DEFAULT '0.00',
  `costo_uni` decimal(20,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`id`),
  KEY `fk45` (`entrada_producto_id`),
  KEY `fk46` (`producto_id`),
  CONSTRAINT `fk45` FOREIGN KEY (`entrada_producto_id`) REFERENCES `entrada_producto` (`id`),
  CONSTRAINT `fk46` FOREIGN KEY (`producto_id`) REFERENCES `producto` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `entrada_producto_detalle`
--

LOCK TABLES `entrada_producto_detalle` WRITE;
/*!40000 ALTER TABLE `entrada_producto_detalle` DISABLE KEYS */;
INSERT INTO `entrada_producto_detalle` VALUES (1,38,6,3.00,75.00),(2,40,2,5.00,60.00),(3,40,1,50.00,75.00);
/*!40000 ALTER TABLE `entrada_producto_detalle` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `establecimiento`
--

DROP TABLE IF EXISTS `establecimiento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `establecimiento` (
  `id` int NOT NULL,
  `ruc` varchar(50) COLLATE utf8mb4_bin NOT NULL,
  `razon_social` varchar(100) COLLATE utf8mb4_bin NOT NULL,
  `rubro` varchar(100) COLLATE utf8mb4_bin NOT NULL,
  `domicilio` varchar(200) COLLATE utf8mb4_bin NOT NULL,
  `celular` bigint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `establecimiento`
--

LOCK TABLES `establecimiento` WRITE;
/*!40000 ALTER TABLE `establecimiento` DISABLE KEYS */;
INSERT INTO `establecimiento` VALUES (1,'10747190351','Confix Cell','servicio tecnico de celulares','Mcdo. Juan Velasco Alvarado, Sector 7, Grupo 1, Mz. ZC, Lote 1, Puesto 29, Villa el Salvador, Lima - Lima',914505738);
/*!40000 ALTER TABLE `establecimiento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `genero`
--

DROP TABLE IF EXISTS `genero`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `genero` (
  `id` int NOT NULL,
  `nombre` varchar(100) COLLATE utf8mb4_bin NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `genero`
--

LOCK TABLES `genero` WRITE;
/*!40000 ALTER TABLE `genero` DISABLE KEYS */;
INSERT INTO `genero` VALUES (1,'Masculino'),(2,'Femenino');
/*!40000 ALTER TABLE `genero` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `liquidacion_tipo`
--

DROP TABLE IF EXISTS `liquidacion_tipo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `liquidacion_tipo` (
  `id` int NOT NULL,
  `nombre` varchar(100) COLLATE utf8mb4_bin NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `liquidacion_tipo`
--

LOCK TABLES `liquidacion_tipo` WRITE;
/*!40000 ALTER TABLE `liquidacion_tipo` DISABLE KEYS */;
INSERT INTO `liquidacion_tipo` VALUES (2,'A crédito'),(1,'Al contado');
/*!40000 ALTER TABLE `liquidacion_tipo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `magnitud`
--

DROP TABLE IF EXISTS `magnitud`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `magnitud` (
  `id` int NOT NULL,
  `nombre` varchar(100) COLLATE utf8mb4_bin NOT NULL,
  `magnitud_tipo_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`),
  KEY `fk7` (`magnitud_tipo_id`),
  CONSTRAINT `fk7` FOREIGN KEY (`magnitud_tipo_id`) REFERENCES `magnitud_tipo` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `magnitud`
--

LOCK TABLES `magnitud` WRITE;
/*!40000 ALTER TABLE `magnitud` DISABLE KEYS */;
INSERT INTO `magnitud` VALUES (1,'uni',1),(2,'m',2),(3,'kg',1);
/*!40000 ALTER TABLE `magnitud` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `magnitud_tipo`
--

DROP TABLE IF EXISTS `magnitud_tipo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `magnitud_tipo` (
  `id` int NOT NULL,
  `nombre` varchar(100) COLLATE utf8mb4_bin NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `magnitud_tipo`
--

LOCK TABLES `magnitud_tipo` WRITE;
/*!40000 ALTER TABLE `magnitud_tipo` DISABLE KEYS */;
INSERT INTO `magnitud_tipo` VALUES (2,'Longitud'),(1,'Masa');
/*!40000 ALTER TABLE `magnitud_tipo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medio_transferencia`
--

DROP TABLE IF EXISTS `medio_transferencia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medio_transferencia` (
  `id` int NOT NULL,
  `nombre` varchar(100) COLLATE utf8mb4_bin NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medio_transferencia`
--

LOCK TABLES `medio_transferencia` WRITE;
/*!40000 ALTER TABLE `medio_transferencia` DISABLE KEYS */;
INSERT INTO `medio_transferencia` VALUES (4,'bcp'),(1,'efectivo'),(5,'interbank'),(6,'izipay'),(3,'plin'),(2,'yape');
/*!40000 ALTER TABLE `medio_transferencia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nota`
--

DROP TABLE IF EXISTS `nota`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nota` (
  `id` int NOT NULL,
  `documento_transaccion_id` int NOT NULL,
  `f_creacion` datetime NOT NULL,
  `descripcion` varchar(1000) COLLATE utf8mb4_bin NOT NULL,
  `usuario_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk69` (`documento_transaccion_id`),
  KEY `fk70` (`usuario_id`),
  CONSTRAINT `fk69` FOREIGN KEY (`documento_transaccion_id`) REFERENCES `documento_transaccion` (`id`),
  CONSTRAINT `fk70` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nota`
--

LOCK TABLES `nota` WRITE;
/*!40000 ALTER TABLE `nota` DISABLE KEYS */;
/*!40000 ALTER TABLE `nota` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nota_servicio`
--

DROP TABLE IF EXISTS `nota_servicio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nota_servicio` (
  `id` int NOT NULL,
  `cliente_id` int DEFAULT NULL,
  `receptor_documento_identificacion_id` int DEFAULT NULL,
  `receptor_cod` varchar(50) COLLATE utf8mb4_bin DEFAULT NULL,
  `receptor_nombre` varchar(100) COLLATE utf8mb4_bin DEFAULT NULL,
  `receptor_celular` bigint DEFAULT NULL,
  `pantalla_modelo_id` int DEFAULT NULL,
  `imei` varchar(100) COLLATE utf8mb4_bin DEFAULT NULL,
  `contrasena` varchar(50) COLLATE utf8mb4_bin DEFAULT NULL,
  `patron` int DEFAULT NULL,
  `diagnostico` varchar(1000) COLLATE utf8mb4_bin DEFAULT NULL,
  `reparacion` varchar(1000) COLLATE utf8mb4_bin DEFAULT NULL,
  `importe_bruto` decimal(20,2) NOT NULL DEFAULT '0.00',
  `descuento` decimal(20,2) NOT NULL DEFAULT '0.00',
  `anticipo` decimal(20,2) NOT NULL DEFAULT '0.00',
  `liquidacion_tipo_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk30` (`cliente_id`),
  KEY `fk31` (`receptor_documento_identificacion_id`),
  KEY `fk32` (`pantalla_modelo_id`),
  KEY `fk33` (`liquidacion_tipo_id`),
  CONSTRAINT `fk29` FOREIGN KEY (`id`) REFERENCES `documento_transaccion` (`id`),
  CONSTRAINT `fk30` FOREIGN KEY (`cliente_id`) REFERENCES `cliente` (`id`),
  CONSTRAINT `fk31` FOREIGN KEY (`receptor_documento_identificacion_id`) REFERENCES `documento_identificacion` (`id`),
  CONSTRAINT `fk32` FOREIGN KEY (`pantalla_modelo_id`) REFERENCES `pantalla_modelo` (`id`),
  CONSTRAINT `fk33` FOREIGN KEY (`liquidacion_tipo_id`) REFERENCES `liquidacion_tipo` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nota_servicio`
--

LOCK TABLES `nota_servicio` WRITE;
/*!40000 ALTER TABLE `nota_servicio` DISABLE KEYS */;
/*!40000 ALTER TABLE `nota_servicio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nota_servicio_accesorio`
--

DROP TABLE IF EXISTS `nota_servicio_accesorio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nota_servicio_accesorio` (
  `id` int NOT NULL,
  `nota_servicio_id` int NOT NULL,
  `nombre` varchar(100) COLLATE utf8mb4_bin NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk34` (`nota_servicio_id`),
  CONSTRAINT `fk34` FOREIGN KEY (`nota_servicio_id`) REFERENCES `nota_servicio` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nota_servicio_accesorio`
--

LOCK TABLES `nota_servicio_accesorio` WRITE;
/*!40000 ALTER TABLE `nota_servicio_accesorio` DISABLE KEYS */;
/*!40000 ALTER TABLE `nota_servicio_accesorio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nota_servicio_credito`
--

DROP TABLE IF EXISTS `nota_servicio_credito`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nota_servicio_credito` (
  `id` int NOT NULL,
  `nota_servicio_id` int NOT NULL,
  `tasa_interes_diario` decimal(20,2) NOT NULL DEFAULT '0.00',
  `importe_capital_inicial` decimal(20,2) NOT NULL DEFAULT '0.00',
  `importe_interes` decimal(20,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`id`),
  UNIQUE KEY `nota_servicio_id` (`nota_servicio_id`),
  CONSTRAINT `fk64` FOREIGN KEY (`nota_servicio_id`) REFERENCES `nota_servicio` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nota_servicio_credito`
--

LOCK TABLES `nota_servicio_credito` WRITE;
/*!40000 ALTER TABLE `nota_servicio_credito` DISABLE KEYS */;
/*!40000 ALTER TABLE `nota_servicio_credito` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nota_servicio_cuota`
--

DROP TABLE IF EXISTS `nota_servicio_cuota`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nota_servicio_cuota` (
  `id` int NOT NULL,
  `nota_servicio_credito_id` int NOT NULL,
  `numero` int NOT NULL DEFAULT '0',
  `f_inicio` datetime DEFAULT NULL,
  `f_vencimiento` datetime DEFAULT NULL,
  `cuota` decimal(20,2) NOT NULL DEFAULT '0.00',
  `amortizacion` decimal(20,2) NOT NULL DEFAULT '0.00',
  `interes` decimal(20,2) NOT NULL DEFAULT '0.00',
  `saldo` decimal(20,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`id`),
  KEY `fk65` (`nota_servicio_credito_id`),
  CONSTRAINT `fk65` FOREIGN KEY (`nota_servicio_credito_id`) REFERENCES `nota_servicio_credito` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nota_servicio_cuota`
--

LOCK TABLES `nota_servicio_cuota` WRITE;
/*!40000 ALTER TABLE `nota_servicio_cuota` DISABLE KEYS */;
/*!40000 ALTER TABLE `nota_servicio_cuota` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nota_venta`
--

DROP TABLE IF EXISTS `nota_venta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nota_venta` (
  `id` int NOT NULL,
  `cliente_id` int DEFAULT NULL,
  `receptor_documento_identificacion_id` int DEFAULT NULL,
  `receptor_cod` varchar(50) COLLATE utf8mb4_bin DEFAULT NULL,
  `receptor_nombre` varchar(100) COLLATE utf8mb4_bin DEFAULT NULL,
  `receptor_celular` bigint DEFAULT NULL,
  `liquidacion_tipo_id` int NOT NULL,
  `importe_anticipo` decimal(20,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`id`),
  KEY `fk10` (`cliente_id`),
  KEY `fk11` (`receptor_documento_identificacion_id`),
  KEY `fk12` (`liquidacion_tipo_id`),
  CONSTRAINT `fk10` FOREIGN KEY (`cliente_id`) REFERENCES `cliente` (`id`),
  CONSTRAINT `fk11` FOREIGN KEY (`receptor_documento_identificacion_id`) REFERENCES `documento_identificacion` (`id`),
  CONSTRAINT `fk12` FOREIGN KEY (`liquidacion_tipo_id`) REFERENCES `liquidacion_tipo` (`id`),
  CONSTRAINT `fk9` FOREIGN KEY (`id`) REFERENCES `documento_transaccion` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nota_venta`
--

LOCK TABLES `nota_venta` WRITE;
/*!40000 ALTER TABLE `nota_venta` DISABLE KEYS */;
INSERT INTO `nota_venta` VALUES (5,NULL,NULL,NULL,NULL,NULL,1,0.00),(6,NULL,NULL,NULL,NULL,NULL,1,0.00),(7,NULL,NULL,NULL,NULL,NULL,1,0.00),(8,NULL,NULL,NULL,NULL,NULL,1,0.00),(9,NULL,NULL,NULL,NULL,NULL,1,0.00),(10,NULL,NULL,NULL,NULL,NULL,1,0.00),(11,NULL,NULL,NULL,NULL,NULL,1,0.00),(12,NULL,NULL,NULL,NULL,NULL,1,0.00),(13,NULL,NULL,NULL,NULL,NULL,1,0.00),(14,5,NULL,NULL,NULL,NULL,1,0.00),(15,5,NULL,NULL,NULL,NULL,1,0.00),(16,NULL,NULL,NULL,NULL,NULL,1,0.00);
/*!40000 ALTER TABLE `nota_venta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nota_venta_credito`
--

DROP TABLE IF EXISTS `nota_venta_credito`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nota_venta_credito` (
  `id` int NOT NULL,
  `nota_venta_id` int NOT NULL,
  `tasa_interes_diario` decimal(20,2) NOT NULL DEFAULT '0.00',
  `importe_capital_inicial` decimal(20,2) NOT NULL DEFAULT '0.00',
  `importe_interes` decimal(20,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`id`),
  UNIQUE KEY `nota_venta_id` (`nota_venta_id`),
  CONSTRAINT `fk62` FOREIGN KEY (`nota_venta_id`) REFERENCES `nota_venta` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nota_venta_credito`
--

LOCK TABLES `nota_venta_credito` WRITE;
/*!40000 ALTER TABLE `nota_venta_credito` DISABLE KEYS */;
/*!40000 ALTER TABLE `nota_venta_credito` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nota_venta_cuota`
--

DROP TABLE IF EXISTS `nota_venta_cuota`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nota_venta_cuota` (
  `id` int NOT NULL,
  `nota_venta_credito_id` int NOT NULL,
  `numero` int NOT NULL DEFAULT '0',
  `f_inicio` datetime DEFAULT NULL,
  `f_vencimiento` datetime DEFAULT NULL,
  `cuota` decimal(20,2) NOT NULL DEFAULT '0.00',
  `amortizacion` decimal(20,2) NOT NULL DEFAULT '0.00',
  `interes` decimal(20,2) NOT NULL DEFAULT '0.00',
  `saldo` decimal(20,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`id`),
  KEY `fk63` (`nota_venta_credito_id`),
  CONSTRAINT `fk63` FOREIGN KEY (`nota_venta_credito_id`) REFERENCES `nota_venta_credito` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nota_venta_cuota`
--

LOCK TABLES `nota_venta_cuota` WRITE;
/*!40000 ALTER TABLE `nota_venta_cuota` DISABLE KEYS */;
/*!40000 ALTER TABLE `nota_venta_cuota` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nota_venta_detalle`
--

DROP TABLE IF EXISTS `nota_venta_detalle`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nota_venta_detalle` (
  `id` int NOT NULL,
  `nota_venta_id` int NOT NULL,
  `elemento_economico_id` int DEFAULT NULL,
  `concepto` varchar(200) COLLATE utf8mb4_bin DEFAULT NULL,
  `cant` decimal(20,2) NOT NULL DEFAULT '0.00',
  `precio_uni` decimal(20,2) NOT NULL DEFAULT '0.00',
  `descuento` decimal(20,2) NOT NULL DEFAULT '0.00',
  `comentario` varchar(200) COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk13` (`nota_venta_id`),
  KEY `fk14` (`elemento_economico_id`),
  CONSTRAINT `fk13` FOREIGN KEY (`nota_venta_id`) REFERENCES `nota_venta` (`id`),
  CONSTRAINT `fk14` FOREIGN KEY (`elemento_economico_id`) REFERENCES `elemento_economico` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nota_venta_detalle`
--

LOCK TABLES `nota_venta_detalle` WRITE;
/*!40000 ALTER TABLE `nota_venta_detalle` DISABLE KEYS */;
INSERT INTO `nota_venta_detalle` VALUES (1,9,9,'HP Impresora',1.00,250.00,0.00,NULL),(2,9,6,'Samsung Horno Microondas',1.00,150.00,50.00,'mensaje aleatorio'),(3,9,8,'Sony Cámara Fotográfica',2.00,300.00,0.00,NULL),(4,10,7,'Apple Tablet',1.00,600.00,0.00,NULL),(5,10,31,'Huawei MATE 8 Original',5.00,550.00,0.00,NULL),(6,11,25,'Soporte Técnico Remoto',1.00,800.00,0.00,NULL),(7,11,11,'Samsung Máquina Herramienta',1.00,5000.00,0.00,NULL),(8,11,6,'Samsung Horno Microondas',5.00,150.00,5.00,NULL),(9,11,31,'Huawei MATE 8 Original',2.00,550.00,0.00,NULL),(10,12,24,'Capacitación en TI uni',1.00,1200.00,0.00,NULL),(11,12,16,'Generador Eléctrico uni',1.00,0.00,45.00,NULL),(12,12,6,'Horno Microondas uni',7.00,150.00,0.00,NULL),(13,12,31,'Huawei MATE 8 Original uni',2.00,550.00,0.00,NULL),(14,13,31,'Huawei MATE 8 Original uni',1.00,550.00,0.00,NULL),(15,13,32,'Huawei MATE 8 Copia uni',1.00,250.50,0.00,NULL),(16,13,31,'Huawei MATE 8 Original uni',2.00,550.00,0.00,NULL),(17,13,32,'Huawei MATE 8 Copia uni',3.00,250.50,0.00,NULL),(18,14,31,'Huawei MATE 8 Original uni',2.00,550.00,0.00,NULL),(19,14,7,'Tablet uni',1.00,600.00,0.00,NULL),(20,16,33,'LG G5 Copia uni',3.00,90.00,0.00,NULL);
/*!40000 ALTER TABLE `nota_venta_detalle` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pantalla_marca`
--

DROP TABLE IF EXISTS `pantalla_marca`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pantalla_marca` (
  `id` int NOT NULL,
  `nombre` varchar(100) COLLATE utf8mb4_bin NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pantalla_marca`
--

LOCK TABLES `pantalla_marca` WRITE;
/*!40000 ALTER TABLE `pantalla_marca` DISABLE KEYS */;
INSERT INTO `pantalla_marca` VALUES (2,'Honor'),(1,'Huawei'),(3,'Iphone'),(4,'LG'),(5,'Motorola'),(6,'OPPO'),(7,'REALME'),(8,'Samsung'),(9,'TCL'),(10,'Tecno'),(11,'UMIDIGI'),(12,'Vivo'),(13,'Xiaomi');
/*!40000 ALTER TABLE `pantalla_marca` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pantalla_modelo`
--

DROP TABLE IF EXISTS `pantalla_modelo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pantalla_modelo` (
  `id` int NOT NULL,
  `nombre` varchar(100) COLLATE utf8mb4_bin NOT NULL,
  `pantalla_marca_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk35` (`pantalla_marca_id`),
  CONSTRAINT `fk35` FOREIGN KEY (`pantalla_marca_id`) REFERENCES `pantalla_marca` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pantalla_modelo`
--

LOCK TABLES `pantalla_modelo` WRITE;
/*!40000 ALTER TABLE `pantalla_modelo` DISABLE KEYS */;
INSERT INTO `pantalla_modelo` VALUES (6,'G PLAY MINI',1),(7,'G7',1),(8,'G8',1),(9,'MATE 10',1),(10,'G PLAY MINI',1),(11,'G7',1),(12,'G8',1),(13,'MATE 10',1),(14,'MATE 10 LITE',1),(15,'MATE 10 PRO CLED',1),(16,'MATE 20 LITE',1),(17,'MATE 7',1),(18,'MATE 8',1),(19,'MATE 9',1),(20,'MATE 9 LITE',1),(21,'MATE 9 PRO',1),(22,'NOVA 5T',1),(23,'NOVA 6',1),(24,'NOVA 81',1),(25,'NOVA 9 SE',1),(26,'NOVA Y60',1),(27,'NOVA Y70',1),(28,'NOVA',1),(29,'P SMART',1),(30,'P10',1),(31,'P10 LITE/NOVA LITE',1),(32,'P10 SELFIE',1),(33,'P10+',1),(34,'P20',1),(35,'P20 LITE',1),(36,'P20 PRO INCELL C/M',1),(37,'P20 PRO OLED C/M',1),(38,'P30 LITE COG GRANDE',1),(39,'P30 LITE ORIGINAL',1),(40,'P30 OLED',1),(41,'P30 TFT C/M',1),(42,'P30 PRO OLED',1),(43,'P30 PRO TFT',1),(44,'P40 LITE',1),(45,'P8',1),(46,'P8 LITE',1),(47,'P8/P9 LITE 2017',1),(48,'P9',1),(49,'P9 LITE',1),(50,'P9 LITE MINI',1),(51,'P9 LITE SMART',1),(52,'PSMART 2019 COG',1),(53,'PSMART 2019 ORIGINAL',1),(54,'PSMART 2021/Y7A',1),(55,'Y3 2017/Y5 LITE 2017',1),(56,'Y5 2018/Y5 LITE 2018',1),(57,'Y5 2019',1),(58,'Y5/Y6 2017',1),(59,'Y5 II/CUN-L03',1),(60,'Y6',1),(61,'Y6 2018',1),(62,'Y6 2019/Y6S/HONOR 8A',1),(63,'Y6 PRO',1),(64,'Y611',1),(65,'Y6P',1),(66,'Y7 2017',1),(67,'Y7 2018/Y7 PRO',1),(68,'Y7 2019',1),(69,'Y7P 2020',1),(70,'Y8P INCELL',1),(71,'Y8P OLED',1),(72,'Y9 2018',1),(73,'Y9 2019/Y8S COG',1),(74,'Y9 2019/Y8S ORIGINAL',1),(75,'Y9 PRIME 2019/Y9S COG',1),(76,'Y9 PRIME 2019/Y9S ORI',1),(77,'Y9A/HONOR X10',1),(78,'50/NOVA 9',2),(79,'50 LITE',2),(80,'8X',2),(81,'X7',2),(82,'X8',2),(83,'X9',2),(84,'5C',3),(85,'5G',3),(86,'5S',3),(87,'6',3),(88,'6+',3),(89,'6S',3),(90,'6S+',3),(91,'7',3),(92,'7+',3),(93,'8',3),(94,'8+',3),(95,'X INCELL',3),(96,'X OLED (GX)',3),(97,'XR INCELL',3),(98,'XS INCELL',3),(99,'XS OLED',3),(100,'XS OLED (GX)',3),(101,'XS MAX INCELL',3),(102,'XS MAX OLED',3),(103,'11 INCELL',3),(104,'11 PRO',3),(105,'G1',4),(106,'G4 STYLU',4),(107,'G5',4),(108,'G6/G6+',4),(109,'K10',4),(110,'K10 2017 C/M',4),(111,'K11/K11+',4),(112,'K20 2019',4),(113,'K200/X STYLE',4),(114,'K22',4),(115,'K220/X POWER',4),(116,'K240/X MAX',4),(117,'K4 2017',4),(118,'K40',4),(119,'K40S',4),(120,'K41S',4),(121,'K42/K52/K62',4),(122,'K50/Q60',4),(123,'K50S',4),(124,'K51',4),(125,'K51S',4),(126,'K61',4),(127,'K7',4),(128,'K8',4),(129,'K8 2017',4),(130,'K8 2018',4),(131,'K9',4),(132,'LEOM',4),(133,'MAGNA',4),(134,'Q STYLUS/+',4),(135,'Q6/G6 MINI',4),(136,'SPIRIT',4),(137,'STYLU2',4),(138,'STYYLUS 3 C/M',4),(139,'STYLU2+',4),(140,'X CAM',4),(141,'C',5),(142,'C C/M',5),(143,'E2',5),(144,'E20',5),(145,'E2020',5),(146,'E30/E40',5),(147,'E32',5),(148,'E4',5),(149,'E4+',5),(150,'E5 PLAY',5),(151,'E5 PLAY GO',5),(152,'E5/G6 PLAY',5),(153,'E5+',5),(154,'E6',5),(155,'E6S/E6i',5),(156,'E7/E7I/E7I POWER',5),(157,'E7+/G9 PLAY',5),(158,'EDGE 20 LITE',5),(159,'EDGE 20 PRO 5G',5),(160,'EDGE 30 PRO 5G/G52',5),(161,'G',5),(162,'G100',5),(163,'G2',5),(164,'G20',5),(165,'G200 5G/EDGE S30',5),(166,'G22',5),(167,'G3',5),(168,'G30',5),(169,'G31/G71/G41 INCELL',5),(170,'G31/G71/G41 OLED',5),(171,'G4 PLAY',5),(172,'G4+',5),(173,'G5',5),(174,'G5 PLAY',5),(175,'G5+',5),(176,'G50 5G',5),(177,'G51',5),(178,'G5G',5),(179,'G5S',5),(180,'G5S+',5),(181,'G6+',5),(182,'G6+ C/M',5),(183,'G60/G60S/G51/G40 FUSION',5),(184,'G7 PLAY',5),(185,'G7 POWER',5),(186,'G7/G7+',5),(187,'G8 PLAY/ONE MACRO',5),(188,'G8 POWER',5),(189,'G8 POWER LITE',5),(190,'G8+',5),(191,'G9 POWER',5),(192,'G9+',5),(193,'G PLAY 2021',5),(194,'ONE',5),(195,'ONE VISION/ONE ACTION',5),(196,'ONE FUSION',5),(197,'X PLAY',5),(198,'Z PLAY OLED',5),(199,'Z2 PLAY OLED',5),(200,'A16/A61S',6),(201,'A53',6),(202,'A54 4G',6),(203,'A54 5G',6),(204,'RENO 5G',6),(205,'RENO 6 LITE OLED',6),(206,'RENO 7',6),(207,'C21Y',7),(208,'6PRO',7),(209,'6I',7),(210,'7',7),(211,'7I/C17',7),(212,'7 PRO',7),(213,'8 5G',7),(214,'9I',7),(215,'C11/C12/C15',7),(216,'C11 2021',7),(217,'C3',7),(218,'8 4G/8 PRO',7),(219,'A01 CORE',8),(220,'A01F',8),(221,'A01M',8),(222,'A11/M11',8),(223,'A12/A125F-A27F/A02',8),(224,'A13 4G',8),(225,'A13 5G',8),(226,'A02 CORE',8),(227,'A21',8),(228,'A21S',8),(229,'A23',8),(230,'A51 C/M',8),(231,'A52',8),(232,'A71 C/M',8),(233,'M21',8),(234,'S6 EDGE',8),(235,'A50 OLED',8),(236,'A42 5G',8),(237,'A510/A5 2016',8),(238,'A6+',8),(239,'A7 2015',8),(240,'A7 2018',8),(241,'A71',8),(242,'A8 2015',8),(243,'E500/E5',8),(244,'J3 PRO',8),(245,'J4',8),(246,'J6',8),(247,'J7',8),(248,'J7 NEO',8),(249,'J7 PRO',8),(250,'J8/J8+',8),(251,'A20',8),(252,'A22 4G',8),(253,'A30',8),(254,'A30 S',8),(255,'A31 GRANDE',8),(256,'A31 PEQUEÑA',8),(257,'A32 4G',8),(258,'A50',8),(259,'A51 GRANDE',8),(260,'A51 PEQUEÑA',8),(261,'A52 4G',8),(262,'A70 GRANDE',8),(263,'A73',8),(264,'NOTE 8',8),(265,'NOTE 9',8),(266,'NOTE 10',8),(267,'NOTE 10+',8),(268,'NOTE 20',8),(269,'NOTE 20 ULTRA',8),(270,'S8',8),(271,'S8+',8),(272,'S9',8),(273,'S9+',8),(274,'S10',8),(275,'S10+',8),(276,'S10E',8),(277,'S20',8),(278,'S20 ULTRA',8),(279,'S20FE',8),(280,'S21 FE',8),(281,'S21',8),(282,'S221 ULTRA',8),(283,'S221 ULTRA',8),(284,'S22 ULTRA',8),(285,'S22+',8),(286,'A03 CORE',8),(287,'A03S/A02S/A03',8),(288,'A10',8),(289,'A10E/A20E',8),(290,'A10S',8),(291,'A12 UNIVERSAL',8),(292,'A20S',8),(293,'A22 4G',8),(294,'A22 5G',8),(295,'A30/A50',8),(296,'A32 4G',8),(297,'A40',8),(298,'A52',8),(299,'A52 4G',8),(300,'A6+',8),(301,'A60',8),(302,'A7 2018',8),(303,'A70',8),(304,'A72 4G',8),(305,'A8+',8),(306,'A80',8),(307,'J4+/J6+',8),(308,'J5 PRIME',8),(309,'J7 PRIME',8),(310,'J737',8),(311,'J8',8),(312,'M10',8),(313,'M20',8),(314,'M21',8),(315,'A20 C/M',8),(316,'A30S C/M',8),(317,'A02',8),(318,'A10',8),(319,'A10S',8),(320,'A11',8),(321,'A12 UNIVERSAL',8),(322,'A20',8),(323,'A20S',8),(324,'A21S',8),(325,'A23',8),(326,'A30/A50',8),(327,'A30S',8),(328,'A31',8),(329,'A51',8),(330,'A70',8),(331,'A71',8),(332,'M21/M30/M30S/M31',8),(333,'A3',8),(334,'A5 METAL',8),(335,'J1 2016',8),(336,'J2',8),(337,'J2 PRO',8),(338,'J4',8),(339,'J5 2016',8),(340,'J5',8),(341,'J5 PRO',8),(342,'J7',8),(343,'J7 2016',8),(344,'J7 PRO',8),(345,'10L',9),(346,'10SE',9),(347,'20L',9),(348,'20L+',9),(349,'20SE',9),(350,'30SE',9),(351,'20 PRO 5G',9),(352,'CAMON 16 PREMIER',10),(353,'CAMON 17',10),(354,'CAMON 17P',10),(355,'CAMON 18 PREMIER',10),(356,'INFINIX HOT 10 LITE',10),(357,'POP 4 LITE',10),(358,'POP 4 V1',10),(359,'POP 5 LITE',10),(360,'POVA NEO',10),(361,'SPARK 5',10),(362,'SPARK 5 AIR',10),(363,'SPARK 6 GO',10),(364,'SPARK 6/CAMON 17',10),(365,'SPARK 7',10),(366,'SPARK 8 PRO',10),(367,'A11 PRO MAX',11),(368,'A9 PRO',11),(369,'BISON',11),(370,'A7 PRO',11),(371,'A7S',11),(372,'A11S',11),(373,'A13S',11),(374,'V21 5G',12),(375,'Y11S',12),(376,'Y20I',12),(377,'Y21S',12),(378,'Y30',12),(379,'Y50',12),(380,'Y51',12),(381,'Y53S',12),(382,'MI 11 LITE',13),(383,'MI 8 LITE',13),(384,'MI 9 LITE',13),(385,'MI 9 LITE OLED',13),(386,'MI 9 SE OLED',13),(387,'MI 9 SE',13),(388,'MI A1',13),(389,'MI A2',13),(390,'MI A2 LITE/REDMI 6 PRO',13),(391,'MI A3',13),(392,'MI A3 OLED C/M',13),(393,'MI G0',13),(394,'MI NOTE 10 5G',13),(395,'MI10T/MI10T PRO 5G',13),(396,'MI9',13),(397,'MI9 OLED',13),(398,'MI9T/MI9T PRO',13),(399,'MI9T/MI9T PRO OLED',13),(400,'NOTE 10 PRO 5G/POCO X3 GT',13),(401,'NOTE 6 PRO',13),(402,'NOTE 10 LITE OLED',13),(403,'NOTE 10 PRO INCELL',13),(404,'NOTE 10 PRO OLED',13),(405,'NOTE 5A',13),(406,'POCO X3',13),(407,'REDMI NOTE 9 PRO/NOTE 9S',13),(408,'REDMI 10C',13),(409,'REDMI 11T/11T PRO',13),(410,'REDMI 4A',13),(411,'REDMI 5',13),(412,'REDMI 5+',13),(413,'REDMI 5A',13),(414,'REDMI 6A',13),(415,'REDMI 9',13),(416,'REDMI 9C/9A',13),(417,'REDMI F1',13),(418,'REDMI NOTE 10 INCELL',13),(419,'REDMI NOTE 11 4G INCELL',13),(420,'REDMI NOTE 1 4G OLED',13),(421,'REDMI NOTE 11 PRO INCELL',13),(422,'REDMI NOTE 11 PRO OLED',13),(423,'REDMI NOTE 4X',13),(424,'REDMI NOTE 5',13),(425,'REDMI NOTE 8 PRO',13),(426,'REDMI NOTE 9',13),(427,'REDMI NOTE 9T',13),(428,'REDMI NOTE 10 OLED',13),(429,'REDMI NOTEd',13);
/*!40000 ALTER TABLE `pantalla_modelo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pantalla_modelo_calidad`
--

DROP TABLE IF EXISTS `pantalla_modelo_calidad`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pantalla_modelo_calidad` (
  `id` int NOT NULL,
  `pantalla_modelo_id` int NOT NULL,
  `calidad_id` int NOT NULL,
  `precio_uni` decimal(20,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`id`),
  KEY `fk37` (`pantalla_modelo_id`),
  KEY `fk38` (`calidad_id`),
  CONSTRAINT `fk36` FOREIGN KEY (`id`) REFERENCES `elemento_economico` (`id`),
  CONSTRAINT `fk37` FOREIGN KEY (`pantalla_modelo_id`) REFERENCES `pantalla_modelo` (`id`),
  CONSTRAINT `fk38` FOREIGN KEY (`calidad_id`) REFERENCES `calidad` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pantalla_modelo_calidad`
--

LOCK TABLES `pantalla_modelo_calidad` WRITE;
/*!40000 ALTER TABLE `pantalla_modelo_calidad` DISABLE KEYS */;
INSERT INTO `pantalla_modelo_calidad` VALUES (31,18,1,550.00),(32,18,2,250.50),(33,107,2,90.00),(34,107,1,120.00);
/*!40000 ALTER TABLE `pantalla_modelo_calidad` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `politica`
--

DROP TABLE IF EXISTS `politica`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `politica` (
  `id` int NOT NULL,
  `descripcion` varchar(500) COLLATE utf8mb4_bin NOT NULL,
  `es_activo` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  CONSTRAINT `politica_chk_1` CHECK ((`es_activo` in (0,1)))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `politica`
--

LOCK TABLES `politica` WRITE;
/*!40000 ALTER TABLE `politica` DISABLE KEYS */;
/*!40000 ALTER TABLE `politica` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `producto`
--

DROP TABLE IF EXISTS `producto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `producto` (
  `id` int NOT NULL,
  `precio_uni` decimal(20,2) NOT NULL DEFAULT '0.00',
  `es_salida` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  CONSTRAINT `fk8` FOREIGN KEY (`id`) REFERENCES `bien` (`id`),
  CONSTRAINT `producto_chk_1` CHECK ((`es_salida` in (0,1)))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `producto`
--

LOCK TABLES `producto` WRITE;
/*!40000 ALTER TABLE `producto` DISABLE KEYS */;
INSERT INTO `producto` VALUES (1,999.99,1),(2,799.99,1),(3,499.99,1),(4,1200.00,1),(5,700.00,0),(6,150.00,1),(7,600.00,1),(8,300.00,1),(9,250.00,1),(10,100.00,1);
/*!40000 ALTER TABLE `producto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `salida_efectivo`
--

DROP TABLE IF EXISTS `salida_efectivo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `salida_efectivo` (
  `id` int NOT NULL,
  `efectivo` decimal(20,2) NOT NULL DEFAULT '0.00',
  `medio_transferencia_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk55` (`medio_transferencia_id`),
  CONSTRAINT `fk54` FOREIGN KEY (`id`) REFERENCES `documento_movimiento` (`id`),
  CONSTRAINT `fk55` FOREIGN KEY (`medio_transferencia_id`) REFERENCES `medio_transferencia` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `salida_efectivo`
--

LOCK TABLES `salida_efectivo` WRITE;
/*!40000 ALTER TABLE `salida_efectivo` DISABLE KEYS */;
INSERT INTO `salida_efectivo` VALUES (8,10.00,1),(13,10.00,1),(17,10.00,1),(21,10.00,1),(23,20.00,3),(27,10.00,1),(33,10.00,1),(45,10.00,1),(47,10.00,1);
/*!40000 ALTER TABLE `salida_efectivo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `salida_pantalla`
--

DROP TABLE IF EXISTS `salida_pantalla`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `salida_pantalla` (
  `id` int NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk59` FOREIGN KEY (`id`) REFERENCES `documento_movimiento` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `salida_pantalla`
--

LOCK TABLES `salida_pantalla` WRITE;
/*!40000 ALTER TABLE `salida_pantalla` DISABLE KEYS */;
INSERT INTO `salida_pantalla` VALUES (31),(42),(48),(51),(53),(54),(56),(58),(60);
/*!40000 ALTER TABLE `salida_pantalla` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `salida_pantalla_detalle`
--

DROP TABLE IF EXISTS `salida_pantalla_detalle`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `salida_pantalla_detalle` (
  `id` int NOT NULL,
  `salida_pantalla_id` int NOT NULL,
  `pantalla_modelo_calidad_id` int NOT NULL,
  `cant` decimal(20,2) NOT NULL DEFAULT '0.00',
  `precio_uni` decimal(20,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`id`),
  KEY `fk60` (`salida_pantalla_id`),
  KEY `fk61` (`pantalla_modelo_calidad_id`),
  CONSTRAINT `fk60` FOREIGN KEY (`salida_pantalla_id`) REFERENCES `salida_pantalla` (`id`),
  CONSTRAINT `fk61` FOREIGN KEY (`pantalla_modelo_calidad_id`) REFERENCES `pantalla_modelo_calidad` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `salida_pantalla_detalle`
--

LOCK TABLES `salida_pantalla_detalle` WRITE;
/*!40000 ALTER TABLE `salida_pantalla_detalle` DISABLE KEYS */;
INSERT INTO `salida_pantalla_detalle` VALUES (1,31,31,2.00,550.00),(2,42,31,2.00,550.00),(3,48,31,1.00,550.00),(4,51,32,12.00,7864.00),(5,51,31,3.00,75.00),(6,53,32,2.00,215.75),(7,53,31,3.00,4502.59),(8,54,32,5.00,315.58),(9,54,31,2.00,215.00),(10,56,33,1.00,0.00),(11,58,33,3.00,90.00),(12,60,33,3.00,90.00);
/*!40000 ALTER TABLE `salida_pantalla_detalle` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `salida_producto`
--

DROP TABLE IF EXISTS `salida_producto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `salida_producto` (
  `id` int NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk25` FOREIGN KEY (`id`) REFERENCES `documento_movimiento` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `salida_producto`
--

LOCK TABLES `salida_producto` WRITE;
/*!40000 ALTER TABLE `salida_producto` DISABLE KEYS */;
INSERT INTO `salida_producto` VALUES (39),(43),(50);
/*!40000 ALTER TABLE `salida_producto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `salida_producto_detalle`
--

DROP TABLE IF EXISTS `salida_producto_detalle`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `salida_producto_detalle` (
  `id` int NOT NULL,
  `salida_producto_id` int NOT NULL,
  `producto_id` int NOT NULL,
  `cant` decimal(20,2) NOT NULL DEFAULT '0.00',
  `precio_uni` decimal(20,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`id`),
  KEY `fk52` (`salida_producto_id`),
  KEY `fk53` (`producto_id`),
  CONSTRAINT `fk52` FOREIGN KEY (`salida_producto_id`) REFERENCES `salida_producto` (`id`),
  CONSTRAINT `fk53` FOREIGN KEY (`producto_id`) REFERENCES `producto` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `salida_producto_detalle`
--

LOCK TABLES `salida_producto_detalle` WRITE;
/*!40000 ALTER TABLE `salida_producto_detalle` DISABLE KEYS */;
INSERT INTO `salida_producto_detalle` VALUES (1,39,6,3.00,149.00),(2,43,6,7.00,150.00),(3,50,7,1.00,600.00);
/*!40000 ALTER TABLE `salida_producto_detalle` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `servicio`
--

DROP TABLE IF EXISTS `servicio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `servicio` (
  `id` int NOT NULL,
  `nombre` varchar(100) COLLATE utf8mb4_bin NOT NULL,
  `servicio_categoria_id` int NOT NULL,
  `precio_uni` decimal(20,2) NOT NULL DEFAULT '0.00',
  `es_salida` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `fk6` (`servicio_categoria_id`),
  CONSTRAINT `fk5` FOREIGN KEY (`id`) REFERENCES `elemento_economico` (`id`),
  CONSTRAINT `fk6` FOREIGN KEY (`servicio_categoria_id`) REFERENCES `servicio_categoria` (`id`),
  CONSTRAINT `servicio_chk_1` CHECK ((`es_salida` in (0,1)))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `servicio`
--

LOCK TABLES `servicio` WRITE;
/*!40000 ALTER TABLE `servicio` DISABLE KEYS */;
INSERT INTO `servicio` VALUES (21,'Consultoría Empresarial',1,1000.00,1),(22,'Desarrollo de Aplicaciones Web',2,200.56,1),(23,'Mantenimiento de Sistemas',3,1500.00,0),(24,'Capacitación en TI',4,1200.00,1),(25,'Soporte Técnico Remoto',5,800.00,1),(26,'Gestión de Redes Sociales',6,900.00,0),(27,'Diseño de Identidad Corporativa',7,1100.00,1),(28,'Asesoría Financiera Personal',8,1300.00,1),(29,'Auditoría Interna',9,1800.00,0),(30,'Investigación de Mercados',10,1700.00,1);
/*!40000 ALTER TABLE `servicio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `servicio_categoria`
--

DROP TABLE IF EXISTS `servicio_categoria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `servicio_categoria` (
  `id` int NOT NULL,
  `nombre` varchar(100) COLLATE utf8mb4_bin NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `servicio_categoria`
--

LOCK TABLES `servicio_categoria` WRITE;
/*!40000 ALTER TABLE `servicio_categoria` DISABLE KEYS */;
INSERT INTO `servicio_categoria` VALUES (8,'Asesoría Financiera'),(9,'Auditoría'),(4,'Capacitación'),(1,'Consultoría'),(2,'Desarrollo de Software'),(7,'Diseño Gráfico'),(10,'Investigación de Mercados'),(3,'Mantenimiento'),(6,'Marketing Digital'),(5,'Soporte Técnico');
/*!40000 ALTER TABLE `servicio_categoria` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `id` int NOT NULL,
  `nombre` varchar(100) COLLATE utf8mb4_bin NOT NULL,
  `usuario` varchar(100) COLLATE utf8mb4_bin NOT NULL,
  `contrasena` varchar(100) COLLATE utf8mb4_bin NOT NULL,
  `es_activo` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  CONSTRAINT `usuario_chk_1` CHECK ((`es_activo` in (0,1)))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (0,'Administrador','admin@confixcell.com','admin123',1),(1,'Jose','jose@confixcell.com','jose123',1),(2,'Eliseo','eliseo@confixcell.com','eliseo123',1),(3,'Marcos','marcos@confixcell.com','marcos123',1),(4,'Maria','mariadogbarber.com','maria123',0);
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-01-16 23:28:19
