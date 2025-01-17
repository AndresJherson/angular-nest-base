drop database servicio_tecnico;
create database servicio_tecnico charset utf8mb4 collate utf8mb4_bin;
use servicio_tecnico;


CREATE TABLE establecimiento (
id INT PRIMARY KEY NOT NULL,
ruc VARCHAR(50) NOT NULL,
razon_social VARCHAR(100) NOT NULL,
rubro VARCHAR(100) NOT NULL,
domicilio VARCHAR(200) NOT NULL,
celular BIGINT);

CREATE TABLE bien (
id INT PRIMARY KEY NOT NULL,
nombre VARCHAR(100) NOT NULL,
bien_marca_id INT NOT NULL,
bien_categoria_id INT NOT NULL,
magnitud_id INT NOT NULL);

CREATE TABLE bien_categoria (
id INT PRIMARY KEY NOT NULL,
nombre VARCHAR(100) NOT NULL UNIQUE);

CREATE TABLE servicio (
id INT PRIMARY KEY NOT NULL,
nombre VARCHAR(100) NOT NULL,
servicio_categoria_id INT NOT NULL,
precio_uni DECIMAL(20,2) NOT NULL DEFAULT 0,
es_salida INT NOT NULL DEFAULT 0 check( es_salida in (0,1) ));

CREATE TABLE servicio_categoria (
id INT PRIMARY KEY NOT NULL,
nombre VARCHAR(100) NOT NULL UNIQUE);

CREATE TABLE magnitud (
id INT PRIMARY KEY NOT NULL,
nombre VARCHAR(100) NOT NULL UNIQUE,
magnitud_tipo_id INT NOT NULL);

CREATE TABLE magnitud_tipo (
id INT PRIMARY KEY NOT NULL,
nombre VARCHAR(100) NOT NULL UNIQUE);

CREATE TABLE bien_marca (
id INT PRIMARY KEY NOT NULL,
nombre VARCHAR(100) NOT NULL UNIQUE);

CREATE TABLE producto (
id INT PRIMARY KEY NOT NULL,
precio_uni DECIMAL(20,2) NOT NULL DEFAULT 0,
es_salida INT NOT NULL DEFAULT 0 check( es_salida in (0,1) ));

CREATE TABLE liquidacion_tipo (
id INT PRIMARY KEY NOT NULL,
nombre VARCHAR(100) NOT NULL UNIQUE);

CREATE TABLE nota_venta (
id INT PRIMARY KEY NOT NULL,
cliente_id INT,
receptor_documento_identificacion_id INT,
receptor_cod VARCHAR(50),
receptor_nombre VARCHAR(100),
receptor_celular BIGINT,
liquidacion_tipo_id INT NOT NULL,
importe_anticipo DECIMAL(20,2) NOT NULL DEFAULT 0);

CREATE TABLE nota_venta_detalle (
id INT PRIMARY KEY NOT NULL,
nota_venta_id INT NOT NULL,
elemento_economico_id INT,
concepto VARCHAR(200),
cant DECIMAL(20,2) NOT NULL DEFAULT 0,
precio_uni DECIMAL(20,2) NOT NULL DEFAULT 0,
descuento DECIMAL(20,2) NOT NULL DEFAULT 0,
comentario VARCHAR(200));

CREATE TABLE bien_capital (
id INT PRIMARY KEY NOT NULL,
f_alta DATETIME NOT NULL,
f_baja DATETIME NOT NULL,
valor_inicial DECIMAL(20,2) NOT NULL DEFAULT 0,
valor_residual DECIMAL(20,2),
es_salida INT NOT NULL DEFAULT 0 check( es_salida in (0,1) ));

CREATE TABLE comprobante_externo (
id INT PRIMARY KEY NOT NULL,
comprobante_tipo_id INT,
cod_externo_serie VARCHAR(50),
cod_externo_numero INT,
emisor_documento_identificacion_id INT,
emisor_cod VARCHAR(50),
emisor_nombre VARCHAR(100),
emisor_celular BIGINT,
liquidacion_tipo_id INT NOT NULL,
importe_anticipo DECIMAL(20,2) NOT NULL DEFAULT 0);

CREATE TABLE comprobante_tipo (
id INT PRIMARY KEY NOT NULL,
nombre VARCHAR(100) NOT NULL UNIQUE);

CREATE TABLE usuario (
id INT PRIMARY KEY NOT NULL,
nombre VARCHAR(100) NOT NULL,
usuario VARCHAR(100) NOT NULL,
contrasena VARCHAR(100) NOT NULL,
es_activo INT NOT NULL DEFAULT 1 check( es_activo in (0,1) ));

CREATE TABLE documento_identificacion (
id INT PRIMARY KEY NOT NULL,
nombre VARCHAR(100) NOT NULL UNIQUE);

CREATE TABLE documento_transaccion (
id INT PRIMARY KEY NOT NULL,
uuid VARCHAR(50) NOT NULL UNIQUE,
cod_serie VARCHAR(50),
cod_numero INT,
f_creacion DATETIME NOT NULL,
f_actualizacion DATETIME NOT NULL,
f_emision DATETIME,
f_anulacion DATETIME,
usuario_id INT NOT NULL,
establecimiento_id INT NOT NULL DEFAULT 1,
concepto VARCHAR(200),
carpeta_id INT);

CREATE TABLE comprobante_externo_detalle (
id INT PRIMARY KEY NOT NULL,
comprobante_externo_id INT NOT NULL,
elemento_economico_id INT,
concepto VARCHAR(200),
cant DECIMAL(20,2) NOT NULL DEFAULT 0,
precio_uni DECIMAL(20,2) NOT NULL DEFAULT 0,
descuento DECIMAL(20,2) NOT NULL DEFAULT 0,
comentario VARCHAR(200));

CREATE TABLE elemento_economico (
id INT PRIMARY KEY NOT NULL,
uuid VARCHAR(50) NOT NULL UNIQUE,
codigo VARCHAR(50) NOT NULL UNIQUE);

CREATE TABLE salida_producto (
id INT PRIMARY KEY NOT NULL);

CREATE TABLE entrada_producto (
id INT PRIMARY KEY NOT NULL);

CREATE TABLE cliente (
id INT PRIMARY KEY NOT NULL,
documento_identificacion_id INT NOT NULL,
codigo VARCHAR(50) NOT NULL,
nombre VARCHAR(100) NOT NULL,
apellido VARCHAR(100) NOT NULL,
genero_id INT NOT NULL,
celular BIGINT,
celular_respaldo BIGINT);

CREATE TABLE genero (
id INT PRIMARY KEY NOT NULL,
nombre VARCHAR(100) NOT NULL);

CREATE TABLE nota_servicio (
id INT PRIMARY KEY NOT NULL,
cliente_id INT,
receptor_documento_identificacion_id INT,
receptor_cod VARCHAR(50),
receptor_nombre VARCHAR(100),
receptor_celular BIGINT,
pantalla_modelo_id INT,
imei VARCHAR(100),
contrasena VARCHAR(50),
patron INT,
diagnostico VARCHAR(1000),
reparacion VARCHAR(1000),
importe_bruto DECIMAL(20,2) NOT NULL DEFAULT 0,
descuento DECIMAL(20,2) NOT NULL DEFAULT 0,
anticipo DECIMAL(20,2) NOT NULL DEFAULT 0,
liquidacion_tipo_id INT NOT NULL);

CREATE TABLE nota_servicio_accesorio (
id INT PRIMARY KEY NOT NULL,
nota_servicio_id INT NOT NULL,
nombre VARCHAR(100) NOT NULL);

CREATE TABLE calidad (
id INT PRIMARY KEY NOT NULL,
nombre VARCHAR(100) NOT NULL UNIQUE);

CREATE TABLE pantalla_modelo (
id INT PRIMARY KEY NOT NULL,
nombre VARCHAR(100) NOT NULL,
pantalla_marca_id INT NOT NULL);

CREATE TABLE pantalla_marca (
id INT PRIMARY KEY NOT NULL,
nombre VARCHAR(100) NOT NULL UNIQUE);

CREATE TABLE pantalla_modelo_calidad (
id INT PRIMARY KEY NOT NULL,
pantalla_modelo_id INT NOT NULL,
calidad_id INT NOT NULL,
precio_uni DECIMAL(20,2) NOT NULL DEFAULT 0);

CREATE TABLE entrada_efectivo (
id INT PRIMARY KEY NOT NULL,
efectivo DECIMAL(20,2) NOT NULL DEFAULT 0,
medio_transferencia_id INT NOT NULL);

CREATE TABLE credito_cobrar (
id INT PRIMARY KEY NOT NULL,
cliente_id INT,
receptor_documento_identificacion_id INT,
receptor_cod VARCHAR(50),
receptor_nombre VARCHAR(100),
receptor_celular BIGINT,
tasa_interes_diario DECIMAL(20,2),
importe_capital_inicial DECIMAL(20,2) NOT NULL DEFAULT 0,
importe_interes DECIMAL(20,2) NOT NULL DEFAULT 0);

CREATE TABLE cuota_cobrar (
id INT PRIMARY KEY NOT NULL,
credito_cobrar_id INT NOT NULL,
numero INT NOT NULL DEFAULT 0,
f_inicio DATETIME,
f_vencimiento DATETIME,
cuota DECIMAL(20,2) NOT NULL DEFAULT 0,
amortizacion DECIMAL(20,2) NOT NULL DEFAULT 0,
interes DECIMAL(20,2) NOT NULL DEFAULT 0,
saldo DECIMAL(20,2) NOT NULL DEFAULT 0);

CREATE TABLE entrada_producto_detalle (
id INT PRIMARY KEY NOT NULL,
entrada_producto_id INT NOT NULL,
producto_id INT NOT NULL,
cant DECIMAL(20,2) NOT NULL DEFAULT 0,
costo_uni DECIMAL(20,2) NOT NULL DEFAULT 0);

CREATE TABLE entrada_pantalla (
id INT PRIMARY KEY NOT NULL);

CREATE TABLE entrada_pantalla_detalle (
id INT PRIMARY KEY NOT NULL,
entrada_pantalla_id INT NOT NULL,
pantalla_modelo_calidad_id INT NOT NULL,
cant DECIMAL(20,2) NOT NULL DEFAULT 0,
costo_uni DECIMAL(20,2) NOT NULL DEFAULT 0);

CREATE TABLE documento_movimiento (
id INT PRIMARY KEY NOT NULL,
uuid VARCHAR(50) NOT NULL UNIQUE,
codigo VARCHAR(50) NOT NULL UNIQUE,
f_emision DATETIME NOT NULL,
f_anulacion DATETIME,
usuario_id INT NOT NULL,
concepto VARCHAR(200),
documento_transaccion_id INT);

CREATE TABLE salida_producto_detalle (
id INT PRIMARY KEY NOT NULL,
salida_producto_id INT NOT NULL,
producto_id INT NOT NULL,
cant DECIMAL(20,2) NOT NULL DEFAULT 0,
precio_uni DECIMAL(20,2) NOT NULL DEFAULT 0);

CREATE TABLE salida_efectivo (
id INT PRIMARY KEY NOT NULL,
efectivo DECIMAL(20,2) NOT NULL DEFAULT 0,
medio_transferencia_id INT NOT NULL);

CREATE TABLE credito_pagar (
id INT PRIMARY KEY NOT NULL,
cod_externo_serie VARCHAR(50),
cod_externo_numero INT,
emisor_documento_identificacion_id INT,
emisor_cod VARCHAR(50),
emisor_nombre VARCHAR(100),
emisor_celular BIGINT,
tasa_interes_diario DECIMAL(20,2) NOT NULL DEFAULT 0,
importe_capital_inicial DECIMAL(20,2) NOT NULL DEFAULT 0,
importe_interes DECIMAL(20,2) NOT NULL DEFAULT 0);

CREATE TABLE cuota_pagar (
id INT PRIMARY KEY NOT NULL,
credito_pagar_id INT NOT NULL,
numero INT NOT NULL DEFAULT 0,
f_inicio DATETIME,
f_vencimiento DATETIME,
cuota DECIMAL(20,2) NOT NULL DEFAULT 0,
amortizacion DECIMAL(20,2) NOT NULL DEFAULT 0,
interes DECIMAL(20,2) NOT NULL DEFAULT 0,
saldo DECIMAL(20,2) NOT NULL DEFAULT 0);

CREATE TABLE salida_pantalla (
id INT PRIMARY KEY NOT NULL);

CREATE TABLE salida_pantalla_detalle (
id INT PRIMARY KEY NOT NULL,
salida_pantalla_id INT NOT NULL,
pantalla_modelo_calidad_id INT NOT NULL,
cant DECIMAL(20,2) NOT NULL DEFAULT 0,
precio_uni DECIMAL(20,2) NOT NULL DEFAULT 0);

CREATE TABLE nota_venta_credito (
id INT PRIMARY KEY NOT NULL,
nota_venta_id INT NOT NULL UNIQUE,
tasa_interes_diario DECIMAL(20,2) NOT NULL DEFAULT 0,
importe_capital_inicial DECIMAL(20,2) NOT NULL DEFAULT 0,
importe_interes DECIMAL(20,2) NOT NULL DEFAULT 0);

CREATE TABLE nota_venta_cuota (
id INT PRIMARY KEY NOT NULL,
nota_venta_credito_id INT NOT NULL,
numero INT NOT NULL DEFAULT 0,
f_inicio DATETIME,
f_vencimiento DATETIME,
cuota DECIMAL(20,2) NOT NULL DEFAULT 0,
amortizacion DECIMAL(20,2) NOT NULL DEFAULT 0,
interes DECIMAL(20,2) NOT NULL DEFAULT 0,
saldo DECIMAL(20,2) NOT NULL DEFAULT 0);

CREATE TABLE nota_servicio_credito (
id INT PRIMARY KEY NOT NULL,
nota_servicio_id INT NOT NULL UNIQUE,
tasa_interes_diario DECIMAL(20,2) NOT NULL DEFAULT 0,
importe_capital_inicial DECIMAL(20,2) NOT NULL DEFAULT 0,
importe_interes DECIMAL(20,2) NOT NULL DEFAULT 0);

CREATE TABLE nota_servicio_cuota (
id INT PRIMARY KEY NOT NULL,
nota_servicio_credito_id INT NOT NULL,
numero INT NOT NULL DEFAULT 0,
f_inicio DATETIME,
f_vencimiento DATETIME,
cuota DECIMAL(20,2) NOT NULL DEFAULT 0,
amortizacion DECIMAL(20,2) NOT NULL DEFAULT 0,
interes DECIMAL(20,2) NOT NULL DEFAULT 0,
saldo DECIMAL(20,2) NOT NULL DEFAULT 0);

CREATE TABLE comprobante_externo_credito (
id INT PRIMARY KEY NOT NULL,
comprobante_externo_id INT NOT NULL UNIQUE,
tasa_interes_diario DECIMAL(20,2) NOT NULL DEFAULT 0,
importe_capital_inicial DECIMAL(20,2) NOT NULL DEFAULT 0,
importe_interes DECIMAL(20,2) NOT NULL DEFAULT 0);

CREATE TABLE comprobante_externo_cuota (
id INT PRIMARY KEY NOT NULL,
comprobante_externo_credito_id INT NOT NULL,
numero INT NOT NULL DEFAULT 0,
f_inicio DATETIME,
f_vencimiento DATETIME,
cuota DECIMAL(20,2) NOT NULL DEFAULT 0,
amortizacion DECIMAL(20,2) NOT NULL DEFAULT 0,
interes DECIMAL(20,2) NOT NULL DEFAULT 0,
saldo DECIMAL(20,2) NOT NULL DEFAULT 0);

CREATE TABLE carpeta (
id INT PRIMARY KEY NOT NULL,
nombre VARCHAR(100) NOT NULL,
f_creacion DATETIME NOT NULL,
usuario_id INT NOT NULL);

CREATE TABLE politica (
id INT PRIMARY KEY NOT NULL,
descripcion VARCHAR(500) NOT NULL,
es_activo INT NOT NULL DEFAULT 1 check( es_activo in (0,1) ));

CREATE TABLE nota (
id INT PRIMARY KEY NOT NULL,
documento_transaccion_id INT NOT NULL,
f_creacion DATETIME NOT NULL,
descripcion VARCHAR(1000) NOT NULL,
usuario_id INT NOT NULL);

CREATE TABLE medio_transferencia (
id INT PRIMARY KEY NOT NULL,
nombre VARCHAR(100) NOT NULL UNIQUE);

CREATE TABLE empleado (
id INT PRIMARY KEY NOT NULL,
documento_identificacion_id INT NOT NULL,
cod VARCHAR(50) NOT NULL,
nombre VARCHAR(100) NOT NULL,
apellido VARCHAR(100) NOT NULL,
domicilio VARCHAR(100) NOT NULL,
genero_id INT NOT NULL,
celular BIGINT,
celular_respaldo BIGINT,
es_tecnico INT NOT NULL DEFAULT 0 check( es_tecnico in (0,1) ),
usuario_id INT UNIQUE);

ALTER	TABLE	bien	ADD	CONSTRAINT	fk1	FOREIGN	KEY	(id)	REFERENCES	elemento_economico(id);
ALTER	TABLE	bien	ADD	CONSTRAINT	fk2	FOREIGN	KEY	(bien_marca_id)	REFERENCES	bien_marca(id);
ALTER	TABLE	bien	ADD	CONSTRAINT	fk3	FOREIGN	KEY	(bien_categoria_id)	REFERENCES	bien_categoria(id);
ALTER	TABLE	bien	ADD	CONSTRAINT	fk4	FOREIGN	KEY	(magnitud_id)	REFERENCES	magnitud(id);
ALTER	TABLE	servicio	ADD	CONSTRAINT	fk5	FOREIGN	KEY	(id)	REFERENCES	elemento_economico(id);
ALTER	TABLE	servicio	ADD	CONSTRAINT	fk6	FOREIGN	KEY	(servicio_categoria_id)	REFERENCES	servicio_categoria(id);
ALTER	TABLE	magnitud	ADD	CONSTRAINT	fk7	FOREIGN	KEY	(magnitud_tipo_id)	REFERENCES	magnitud_tipo(id);
ALTER	TABLE	producto	ADD	CONSTRAINT	fk8	FOREIGN	KEY	(id)	REFERENCES	bien(id);
ALTER	TABLE	nota_venta	ADD	CONSTRAINT	fk9	FOREIGN	KEY	(id)	REFERENCES	documento_transaccion(id);
ALTER	TABLE	nota_venta	ADD	CONSTRAINT	fk10	FOREIGN	KEY	(cliente_id)	REFERENCES	cliente(id);
ALTER	TABLE	nota_venta	ADD	CONSTRAINT	fk11	FOREIGN	KEY	(receptor_documento_identificacion_id)	REFERENCES	documento_identificacion(id);
ALTER	TABLE	nota_venta	ADD	CONSTRAINT	fk12	FOREIGN	KEY	(liquidacion_tipo_id)	REFERENCES	liquidacion_tipo(id);
ALTER	TABLE	nota_venta_detalle	ADD	CONSTRAINT	fk13	FOREIGN	KEY	(nota_venta_id)	REFERENCES	nota_venta(id);
ALTER	TABLE	nota_venta_detalle	ADD	CONSTRAINT	fk14	FOREIGN	KEY	(elemento_economico_id)	REFERENCES	elemento_economico(id);
ALTER	TABLE	bien_capital	ADD	CONSTRAINT	fk15	FOREIGN	KEY	(id)	REFERENCES	bien(id);
ALTER	TABLE	comprobante_externo	ADD	CONSTRAINT	fk16	FOREIGN	KEY	(id)	REFERENCES	documento_transaccion(id);
ALTER	TABLE	comprobante_externo	ADD	CONSTRAINT	fk17	FOREIGN	KEY	(comprobante_tipo_id)	REFERENCES	comprobante_tipo(id);
ALTER	TABLE	comprobante_externo	ADD	CONSTRAINT	fk18	FOREIGN	KEY	(emisor_documento_identificacion_id)	REFERENCES	documento_identificacion(id);
ALTER	TABLE	comprobante_externo	ADD	CONSTRAINT	fk19	FOREIGN	KEY	(liquidacion_tipo_id)	REFERENCES	liquidacion_tipo(id);
ALTER	TABLE	documento_transaccion	ADD	CONSTRAINT	fk20	FOREIGN	KEY	(usuario_id)	REFERENCES	usuario(id);
ALTER	TABLE	documento_transaccion	ADD	CONSTRAINT	fk21	FOREIGN	KEY	(establecimiento_id)	REFERENCES	establecimiento(id);
ALTER	TABLE	documento_transaccion	ADD	CONSTRAINT	fk22	FOREIGN	KEY	(carpeta_id)	REFERENCES	carpeta(id);
ALTER	TABLE	comprobante_externo_detalle	ADD	CONSTRAINT	fk23	FOREIGN	KEY	(comprobante_externo_id)	REFERENCES	comprobante_externo(id);
ALTER	TABLE	comprobante_externo_detalle	ADD	CONSTRAINT	fk24	FOREIGN	KEY	(elemento_economico_id)	REFERENCES	elemento_economico(id);
ALTER	TABLE	salida_producto	ADD	CONSTRAINT	fk25	FOREIGN	KEY	(id)	REFERENCES	documento_movimiento(id);
ALTER	TABLE	entrada_producto	ADD	CONSTRAINT	fk26	FOREIGN	KEY	(id)	REFERENCES	documento_movimiento(id);
ALTER	TABLE	cliente	ADD	CONSTRAINT	fk27	FOREIGN	KEY	(documento_identificacion_id)	REFERENCES	documento_identificacion(id);
ALTER	TABLE	cliente	ADD	CONSTRAINT	fk28	FOREIGN	KEY	(genero_id)	REFERENCES	genero(id);
ALTER	TABLE	nota_servicio	ADD	CONSTRAINT	fk29	FOREIGN	KEY	(id)	REFERENCES	documento_transaccion(id);
ALTER	TABLE	nota_servicio	ADD	CONSTRAINT	fk30	FOREIGN	KEY	(cliente_id)	REFERENCES	cliente(id);
ALTER	TABLE	nota_servicio	ADD	CONSTRAINT	fk31	FOREIGN	KEY	(receptor_documento_identificacion_id)	REFERENCES	documento_identificacion(id);
ALTER	TABLE	nota_servicio	ADD	CONSTRAINT	fk32	FOREIGN	KEY	(pantalla_modelo_id)	REFERENCES	pantalla_modelo(id);
ALTER	TABLE	nota_servicio	ADD	CONSTRAINT	fk33	FOREIGN	KEY	(liquidacion_tipo_id)	REFERENCES	liquidacion_tipo(id);
ALTER	TABLE	nota_servicio_accesorio	ADD	CONSTRAINT	fk34	FOREIGN	KEY	(nota_servicio_id)	REFERENCES	nota_servicio(id);
ALTER	TABLE	pantalla_modelo	ADD	CONSTRAINT	fk35	FOREIGN	KEY	(pantalla_marca_id)	REFERENCES	pantalla_marca(id);
ALTER	TABLE	pantalla_modelo_calidad	ADD	CONSTRAINT	fk36	FOREIGN	KEY	(id)	REFERENCES	elemento_economico(id);
ALTER	TABLE	pantalla_modelo_calidad	ADD	CONSTRAINT	fk37	FOREIGN	KEY	(pantalla_modelo_id)	REFERENCES	pantalla_modelo(id);
ALTER	TABLE	pantalla_modelo_calidad	ADD	CONSTRAINT	fk38	FOREIGN	KEY	(calidad_id)	REFERENCES	calidad(id);
ALTER	TABLE	entrada_efectivo	ADD	CONSTRAINT	fk39	FOREIGN	KEY	(id)	REFERENCES	documento_movimiento(id);
ALTER	TABLE	entrada_efectivo	ADD	CONSTRAINT	fk40	FOREIGN	KEY	(medio_transferencia_id)	REFERENCES	medio_transferencia(id);
ALTER	TABLE	credito_cobrar	ADD	CONSTRAINT	fk41	FOREIGN	KEY	(id)	REFERENCES	documento_transaccion(id);
ALTER	TABLE	credito_cobrar	ADD	CONSTRAINT	fk42	FOREIGN	KEY	(cliente_id)	REFERENCES	cliente(id);
ALTER	TABLE	credito_cobrar	ADD	CONSTRAINT	fk43	FOREIGN	KEY	(receptor_documento_identificacion_id)	REFERENCES	documento_identificacion(id);
ALTER	TABLE	cuota_cobrar	ADD	CONSTRAINT	fk44	FOREIGN	KEY	(credito_cobrar_id)	REFERENCES	credito_cobrar(id);
ALTER	TABLE	entrada_producto_detalle	ADD	CONSTRAINT	fk45	FOREIGN	KEY	(entrada_producto_id)	REFERENCES	entrada_producto(id);
ALTER	TABLE	entrada_producto_detalle	ADD	CONSTRAINT	fk46	FOREIGN	KEY	(producto_id)	REFERENCES	producto(id);
ALTER	TABLE	entrada_pantalla	ADD	CONSTRAINT	fk47	FOREIGN	KEY	(id)	REFERENCES	documento_movimiento(id);
ALTER	TABLE	entrada_pantalla_detalle	ADD	CONSTRAINT	fk48	FOREIGN	KEY	(entrada_pantalla_id)	REFERENCES	entrada_pantalla(id);
ALTER	TABLE	entrada_pantalla_detalle	ADD	CONSTRAINT	fk49	FOREIGN	KEY	(pantalla_modelo_calidad_id)	REFERENCES	pantalla_modelo_calidad(id);
ALTER	TABLE	documento_movimiento	ADD	CONSTRAINT	fk50	FOREIGN	KEY	(usuario_id)	REFERENCES	usuario(id);
ALTER	TABLE	documento_movimiento	ADD	CONSTRAINT	fk51	FOREIGN	KEY	(documento_transaccion_id)	REFERENCES	documento_transaccion(id);
ALTER	TABLE	salida_producto_detalle	ADD	CONSTRAINT	fk52	FOREIGN	KEY	(salida_producto_id)	REFERENCES	salida_producto(id);
ALTER	TABLE	salida_producto_detalle	ADD	CONSTRAINT	fk53	FOREIGN	KEY	(producto_id)	REFERENCES	producto(id);
ALTER	TABLE	salida_efectivo	ADD	CONSTRAINT	fk54	FOREIGN	KEY	(id)	REFERENCES	documento_movimiento(id);
ALTER	TABLE	salida_efectivo	ADD	CONSTRAINT	fk55	FOREIGN	KEY	(medio_transferencia_id)	REFERENCES	medio_transferencia(id);
ALTER	TABLE	credito_pagar	ADD	CONSTRAINT	fk56	FOREIGN	KEY	(id)	REFERENCES	documento_transaccion(id);
ALTER	TABLE	credito_pagar	ADD	CONSTRAINT	fk57	FOREIGN	KEY	(emisor_documento_identificacion_id)	REFERENCES	documento_identificacion(id);
ALTER	TABLE	cuota_pagar	ADD	CONSTRAINT	fk58	FOREIGN	KEY	(credito_pagar_id)	REFERENCES	credito_pagar(id);
ALTER	TABLE	salida_pantalla	ADD	CONSTRAINT	fk59	FOREIGN	KEY	(id)	REFERENCES	documento_movimiento(id);
ALTER	TABLE	salida_pantalla_detalle	ADD	CONSTRAINT	fk60	FOREIGN	KEY	(salida_pantalla_id)	REFERENCES	salida_pantalla(id);
ALTER	TABLE	salida_pantalla_detalle	ADD	CONSTRAINT	fk61	FOREIGN	KEY	(pantalla_modelo_calidad_id)	REFERENCES	pantalla_modelo_calidad(id);
ALTER	TABLE	nota_venta_credito	ADD	CONSTRAINT	fk62	FOREIGN	KEY	(nota_venta_id)	REFERENCES	nota_venta(id);
ALTER	TABLE	nota_venta_cuota	ADD	CONSTRAINT	fk63	FOREIGN	KEY	(nota_venta_credito_id)	REFERENCES	nota_venta_credito(id);
ALTER	TABLE	nota_servicio_credito	ADD	CONSTRAINT	fk64	FOREIGN	KEY	(nota_servicio_id)	REFERENCES	nota_servicio(id);
ALTER	TABLE	nota_servicio_cuota	ADD	CONSTRAINT	fk65	FOREIGN	KEY	(nota_servicio_credito_id)	REFERENCES	nota_servicio_credito(id);
ALTER	TABLE	comprobante_externo_credito	ADD	CONSTRAINT	fk66	FOREIGN	KEY	(comprobante_externo_id)	REFERENCES	comprobante_externo(id);
ALTER	TABLE	comprobante_externo_cuota	ADD	CONSTRAINT	fk67	FOREIGN	KEY	(comprobante_externo_credito_id)	REFERENCES	comprobante_externo_credito(id);
ALTER	TABLE	carpeta	ADD	CONSTRAINT	fk68	FOREIGN	KEY	(usuario_id)	REFERENCES	usuario(id);
ALTER	TABLE	nota	ADD	CONSTRAINT	fk69	FOREIGN	KEY	(documento_transaccion_id)	REFERENCES	documento_transaccion(id);
ALTER	TABLE	nota	ADD	CONSTRAINT	fk70	FOREIGN	KEY	(usuario_id)	REFERENCES	usuario(id);
ALTER	TABLE	empleado	ADD	CONSTRAINT	fk71	FOREIGN	KEY	(documento_identificacion_id)	REFERENCES	documento_identificacion(id);
ALTER	TABLE	empleado	ADD	CONSTRAINT	fk72	FOREIGN	KEY	(genero_id)	REFERENCES	genero(id);
ALTER	TABLE	empleado	ADD	CONSTRAINT	fk73	FOREIGN	KEY	(usuario_id)	REFERENCES	usuario(id);
alter table documento_transaccion add constraint u1 unique( cod_serie, cod_numero );



------ PRODUCTOS

INSERT INTO magnitud_tipo VALUES
(1, 'Masa'),
(2, 'Longitud');

INSERT INTO magnitud VALUES
(1, 'uni', 1),
(2, 'm', 2),
(3, 'kg', 1);

-- Insertar datos en la tabla bien_categoria
INSERT INTO bien_categoria (id, nombre) VALUES
(1, 'Celular'),
(2, 'Equipos');

-- Insertar datos en la tabla bien_marca
INSERT INTO bien_marca (id, nombre) VALUES
(1, 'Samsung'),
(2, 'Apple'),
(3, 'Sony'),
(4, 'LG'),
(5, 'HP');

-- Insertar datos en la tabla elemento_economico
INSERT INTO elemento_economico (id, uuid, codigo) VALUES
(1, 'ec43d6dd-4dbd-4ade-a796-03102f2cb280','PRDCT1'),
(2, 'ca75841d-8aab-4e0e-9f7a-09cbe512b040','PRDCT2'),
(3, 'fe669027-7b5d-40ae-a7ea-7b29907559db','PRDCT3'),
(4, '47f9de53-36de-486e-aa64-39465eb47391','PRDCT4'),
(5, '8f3ae837-dd09-4f28-8391-f920e261b53d','PRDCT5'),
(6, '46211642-b35d-466c-80d8-f4ca428b4da8','PRDCT6'),
(7, '3e5296f5-8bd2-4fc3-9597-e3dcd68c18f2','PRDCT7'),
(8, '4dd16030-321d-4093-b63e-ad08d853bbba','PRDCT8'),
(9, '882d20bb-bb5d-4d72-9e74-b8f6740ced33','PRDCT9'),
(10,'f6ce37f1-96f1-4973-849f-43e870016dd0', 'PRDCT10');

-- Insertar datos en la tabla bien
INSERT INTO bien (id, nombre, bien_marca_id, bien_categoria_id, magnitud_id) VALUES
(1, 'Laptop', 2, 1, 1),
(2, 'Smartphone', 2, 1, 1),
(3, 'Televisión', 3, 1, 1),
(4, 'Refrigerador', 4, 2, 1),
(5, 'Lavadora', 4, 2, 1),
(6, 'Horno Microondas', 1, 2, 1),
(7, 'Tablet', 2, 1, 1),
(8, 'Cámara Fotográfica', 3, 1, 1),
(9, 'Impresora', 5, 1, 1),
(10, 'Router', 1, 1, 1);

-- Insertar datos en la tabla producto
INSERT INTO producto (id, precio_uni, es_salida) VALUES
(1, 999.99, 1),
(2, 799.99, 1),
(3, 499.99, 1),
(4, 1200.00, 1),
(5, 700.00, 1),
(6, 150.00, 1),
(7, 600.00, 1),
(8, 300.00, 1),
(9, 250.00, 1),
(10, 100.00, 1);


------ BIEN DE CAPITAL

-- Insertar datos en la tabla bien_categoria
INSERT INTO bien_categoria (id, nombre) VALUES
(3, 'Maquinaria Pesada'),
(4, 'Vehículos de Transporte'),
(5, 'Equipos Eléctricos');

-- Insertar datos en la tabla bien_marca
INSERT INTO bien_marca (id, nombre) VALUES
(6, 'Caterpillar'),
(7, 'John Deere'),
(8, 'Volvo'),
(9, 'Komatsu'),
(10, 'Siemens');

-- Insertar datos en la tabla elemento_economico
INSERT INTO elemento_economico (id, uuid, codigo) VALUES
(11, 'f2e21c31-b5df-4989-a87e-9411271ea156', 'BNDCPTL11'),
(12, '71679482-da8f-4e97-9db3-87a797a81907', 'BNDCPTL12'),
(13, '0f5e7a95-51d5-468b-936b-4ef7d59722fc', 'BNDCPTL13'),
(14, '2d0045a9-1e3a-4415-8cb7-b54a415f1ac1', 'BNDCPTL14'),
(15, '193c47b3-44d9-4c1b-99d2-54cfdf43b196', 'BNDCPTL15'),
(16, 'a7d8cceb-6735-41f2-8156-f824facea40a', 'BNDCPTL16'),
(17, '997e0578-3003-4bea-a744-e432c0d81f26', 'BNDCPTL17'),
(18, '00fce283-4d7f-4803-8093-8fe5c09d40fc', 'BNDCPTL18'),
(19, '26e8c4f7-29a1-4072-9e2c-6c7e3b61d09e', 'BNDCPTL19'),
(20, '2c61b471-5382-41d3-802e-5c6df0d604a1', 'BNDCPTL20');

-- Insertar datos en la tabla bien
INSERT INTO bien (id, nombre, bien_marca_id, bien_categoria_id, magnitud_id) VALUES
(11, 'Máquina Herramienta', 1, 1, 1),
(12, 'Camión', 3, 2, 1),
(13, 'Excavadora', 4, 1, 1),
(14, 'Tractor', 2, 1, 1),
(15, 'Grúa', 3, 1, 1),
(16, 'Generador Eléctrico', 5, 3, 1),
(17, 'Montacargas', 1, 1, 1),
(18, 'Compresor de Aire', 1, 1, 1),
(19, 'Transformador', 5, 3, 1),
(20, 'Bomba Hidráulica', 4, 1, 1);

-- Insertar datos en la tabla bien_capital
INSERT INTO bien_capital (id, f_alta, f_baja, valor_inicial, valor_residual, es_salida) VALUES
(11, '2024-01-01 10:00:00', '2025-01-01 10:00:00', 10000.00, 5000.00, 1),
(12, '2023-06-15 14:30:00', '2024-06-15 14:30:00', 15000.00, 7500.00, 0),
(13, '2022-09-20 09:45:00', '2023-09-20 09:45:00', 20000.00, 10000.00, 1),
(14, '2021-12-01 12:00:00', '2022-12-01 12:00:00', 12000.00, 6000.00, 1),
(15, '2024-03-25 08:15:00', '2025-03-25 08:15:00', 18000.00, 9000.00, 0),
(16, '2023-07-10 11:30:00', '2024-07-10 11:30:00', 14000.00, 7000.00, 1),
(17, '2022-05-05 15:00:00', '2023-05-05 15:00:00', 13000.00, 6500.00, 0),
(18, '2021-11-11 13:45:00', '2022-11-11 13:45:00', 17000.00, 8500.00, 1),
(19, '2024-02-20 07:30:00', '2025-02-20 07:30:00', 16000.00, 8000.00, 1),
(20, '2023-08-18 10:15:00', '2024-08-18 10:15:00', 11000.00, 5500.00, 0);



-- SERVICIOS

-- Inserciones para la tabla servicio_categoria
INSERT INTO servicio_categoria (id, nombre) VALUES
(1, 'Consultoría'),
(2, 'Desarrollo de Software'),
(3, 'Mantenimiento'),
(4, 'Capacitación'),
(5, 'Soporte Técnico'),
(6, 'Marketing Digital'),
(7, 'Diseño Gráfico'),
(8, 'Asesoría Financiera'),
(9, 'Auditoría'),
(10, 'Investigación de Mercados');

-- Inserciones para la tabla elemento_economico
INSERT INTO elemento_economico (id, uuid, codigo) VALUES
(21, 'e82a1e32-3ae3-40ab-99e9-c61aeb2af9f5', 'SRVC21'),
(22, '106305f3-3aa3-4251-8563-e91dbb9524b5', 'SRVC22'),
(23, '71d2277a-7a08-4135-adf1-1f109de8d353', 'SRVC23'),
(24, '15dc8961-5645-4a7b-ab0e-e8368b55b553', 'SRVC24'),
(25, '64bf39ee-997c-42fd-84f2-9993a997342d', 'SRVC25'),
(26, '1785140d-2bd8-4af5-bf66-3dfe50a5731e', 'SRVC26'),
(27, '3b1358f4-727c-4995-bb41-3eee90a16ee3', 'SRVC27'),
(28, '4b1ed1e9-da53-461a-8781-a38c8172bdae', 'SRVC28'),
(29, '73c00bb3-63de-4087-b221-4157a4b15768', 'SRVC29'),
(30, '482de4da-e3a5-4a34-b263-8a212edbcb3d', 'SRVC30');

-- Inserciones para la tabla servicio
INSERT INTO servicio (id, nombre, servicio_categoria_id, precio_uni, es_salida) VALUES
(21, 'Consultoría Empresarial', 1, 1000.00, 1),
(22, 'Desarrollo de Aplicaciones Web', 2, 2000.00, 1),
(23, 'Mantenimiento de Sistemas', 3, 1500.00, 0),
(24, 'Capacitación en TI', 4, 1200.00, 1),
(25, 'Soporte Técnico Remoto', 5, 800.00, 1),
(26, 'Gestión de Redes Sociales', 6, 900.00, 0),
(27, 'Diseño de Identidad Corporativa', 7, 1100.00, 1),
(28, 'Asesoría Financiera Personal', 8, 1300.00, 1),
(29, 'Auditoría Interna', 9, 1800.00, 0),
(30, 'Investigación de Mercados', 10, 1700.00, 1);



---- PANTALLAS

INSERT INTO pantalla_marca (id, nombre) VALUES
(1, 'Huawei'),
(2, 'Honor'),
(3, 'Iphone'),
(4, 'LG'),
(5, 'Motorola'),
(6, 'OPPO'),
(7, 'REALME'),
(8, 'Samsung'),
(9, 'TCL'),
(10, 'Tecno'),
(11, 'UMIDIGI'),
(12, 'Vivo'),
(13, 'Xiaomi');

INSERT INTO calidad (id, nombre) VALUES
(1, 'Original'),
(2, 'Copia');


-- pantalla modelo

insert into pantalla_modelo values
(6,'G PLAY MINI',1),
(7,'G7',1),
(8,'G8',1),
(9,'MATE 10',1),
(10,'G PLAY MINI',1),
(11,'G7',1),
(12,'G8',1),
(13,'MATE 10',1),
(14,'MATE 10 LITE',1),
(15,'MATE 10 PRO CLED',1),
(16,'MATE 20 LITE',1),
(17,'MATE 7',1),
(18,'MATE 8',1),
(19,'MATE 9',1),
(20,'MATE 9 LITE',1),
(21,'MATE 9 PRO',1),
(22,'NOVA 5T',1),
(23,'NOVA 6',1),
(24,'NOVA 81',1),
(25,'NOVA 9 SE',1),
(26,'NOVA Y60',1),
(27,'NOVA Y70',1),
(28,'NOVA',1),
(29,'P SMART',1),
(30,'P10',1),
(31,'P10 LITE/NOVA LITE',1),
(32,'P10 SELFIE',1),
(33,'P10+',1),
(34,'P20',1),
(35,'P20 LITE',1),
(36,'P20 PRO INCELL C/M',1),
(37,'P20 PRO OLED C/M',1),
(38,'P30 LITE COG GRANDE',1),
(39,'P30 LITE ORIGINAL',1),
(40,'P30 OLED',1),
(41,'P30 TFT C/M',1),
(42,'P30 PRO OLED',1),
(43,'P30 PRO TFT',1),
(44,'P40 LITE',1),
(45,'P8',1),
(46,'P8 LITE',1),
(47,'P8/P9 LITE 2017',1),
(48,'P9',1),
(49,'P9 LITE',1),
(50,'P9 LITE MINI',1),
(51,'P9 LITE SMART',1),
(52,'PSMART 2019 COG',1),
(53,'PSMART 2019 ORIGINAL',1),
(54,'PSMART 2021/Y7A',1),
(55,'Y3 2017/Y5 LITE 2017',1),
(56,'Y5 2018/Y5 LITE 2018',1),
(57,'Y5 2019',1),
(58,'Y5/Y6 2017',1),
(59,'Y5 II/CUN-L03',1),
(60,'Y6',1),
(61,'Y6 2018',1),
(62,'Y6 2019/Y6S/HONOR 8A',1),
(63,'Y6 PRO',1),
(64,'Y611',1),
(65,'Y6P',1),
(66,'Y7 2017',1),
(67,'Y7 2018/Y7 PRO',1),
(68,'Y7 2019',1),
(69,'Y7P 2020',1),
(70,'Y8P INCELL',1),
(71,'Y8P OLED',1),
(72,'Y9 2018',1),
(73,'Y9 2019/Y8S COG',1),
(74,'Y9 2019/Y8S ORIGINAL',1),
(75,'Y9 PRIME 2019/Y9S COG',1),
(76,'Y9 PRIME 2019/Y9S ORI',1),
(77,'Y9A/HONOR X10',1);

insert into pantalla_modelo values
(78, '50/NOVA 9',2),
(79, '50 LITE',2),
(80, '8X',2),
(81, 'X7',2),
(82, 'X8',2),
(83, 'X9',2);

insert into pantalla_modelo values
(84,'5C',3),
(85,'5G',3),
(86,'5S',3),
(87,'6',3),
(88,'6+',3),
(89,'6S',3),
(90,'6S+',3),
(91,'7',3),
(92,'7+',3),
(93,'8',3),
(94,'8+',3),
(95,'X INCELL',3),
(96,'X OLED (GX)',3),
(97,'XR INCELL',3),
(98,'XS INCELL',3),
(99,'XS OLED',3),
(100,'XS OLED (GX)',3),
(101,'XS MAX INCELL',3),
(102,'XS MAX OLED',3),
(103,'11 INCELL',3),
(104,'11 PRO',3);

insert into pantalla_modelo values
(105,'G1',4),
(106,'G4 STYLU',4),
(107,'G5',4),
(108,'G6/G6+',4),
(109,'K10',4),
(110,'K10 2017 C/M',4),
(111,'K11/K11+',4),
(112,'K20 2019',4),
(113,'K200/X STYLE',4),
(114,'K22',4),
(115,'K220/X POWER',4),
(116,'K240/X MAX',4),
(117,'K4 2017',4),
(118,'K40',4),
(119,'K40S',4),
(120,'K41S',4),
(121,'K42/K52/K62',4),
(122,'K50/Q60',4),
(123,'K50S',4),
(124,'K51',4),
(125,'K51S',4),
(126,'K61',4),
(127,'K7',4),
(128,'K8',4),
(129,'K8 2017',4),
(130,'K8 2018',4),
(131,'K9',4),
(132,'LEOM',4),
(133,'MAGNA',4),
(134,'Q STYLUS/+',4),
(135,'Q6/G6 MINI',4),
(136,'SPIRIT',4),
(137,'STYLU2',4),
(138,'STYYLUS 3 C/M',4),
(139,'STYLU2+',4),
(140,'X CAM',4);

insert into pantalla_modelo values
(141,'C',5),
(142,'C C/M',5),
(143,'E2',5),
(144,'E20',5),
(145,'E2020',5),
(146,'E30/E40',5),
(147,'E32',5),
(148,'E4',5),
(149,'E4+',5),
(150,'E5 PLAY',5),
(151,'E5 PLAY GO',5),
(152,'E5/G6 PLAY',5),
(153,'E5+',5),
(154,'E6',5),
(155,'E6S/E6i',5),
(156,'E7/E7I/E7I POWER',5),
(157,'E7+/G9 PLAY',5),
(158,'EDGE 20 LITE',5),
(159,'EDGE 20 PRO 5G',5),
(160,'EDGE 30 PRO 5G/G52',5),
(161,'G',5),
(162,'G100',5),
(163,'G2',5),
(164,'G20',5),
(165,'G200 5G/EDGE S30',5),
(166,'G22',5),
(167,'G3',5),
(168,'G30',5),
(169,'G31/G71/G41 INCELL',5),
(170,'G31/G71/G41 OLED',5),
(171,'G4 PLAY',5),
(172,'G4+',5),
(173,'G5',5),
(174,'G5 PLAY',5),
(175,'G5+',5),
(176,'G50 5G',5),
(177,'G51',5),
(178,'G5G',5),
(179,'G5S',5),
(180,'G5S+',5),
(181,'G6+',5),
(182,'G6+ C/M',5),
(183,'G60/G60S/G51/G40 FUSION',5),
(184,'G7 PLAY',5),
(185,'G7 POWER',5),
(186,'G7/G7+',5),
(187,'G8 PLAY/ONE MACRO',5),
(188,'G8 POWER',5),
(189,'G8 POWER LITE',5),
(190,'G8+',5),
(191,'G9 POWER',5),
(192,'G9+',5),
(193,'G PLAY 2021',5),
(194,'ONE',5),
(195,'ONE VISION/ONE ACTION',5),
(196,'ONE FUSION',5),
(197,'X PLAY',5),
(198,'Z PLAY OLED',5),
(199,'Z2 PLAY OLED',5);

insert into pantalla_modelo values
(200,'A16/A61S',6),
(201,'A53',6),
(202,'A54 4G',6),
(203,'A54 5G',6),
(204,'RENO 5G',6),
(205,'RENO 6 LITE OLED',6),
(206,'RENO 7',6);

insert into pantalla_modelo values
(207,'C21Y',7),
(208,'6PRO',7),
(209,'6I',7),
(210,'7',7),
(211,'7I/C17',7),
(212,'7 PRO',7),
(213,'8 5G',7),
(214,'9I',7),
(215,'C11/C12/C15',7),
(216,'C11 2021',7),
(217,'C3',7),
(218,'8 4G/8 PRO',7);

insert into pantalla_modelo values
(219,'A01 CORE',8),
(220,'A01F',8),
(221,'A01M',8),
(222,'A11/M11',8),
(223,'A12/A125F-A27F/A02',8),
(224,'A13 4G',8),
(225,'A13 5G',8),
(226,'A02 CORE',8),
(227,'A21',8),
(228,'A21S',8),
(229,'A23',8),
(230,'A51 C/M',8),
(231,'A52',8),
(232,'A71 C/M',8),
(233,'M21',8),
(234,'S6 EDGE',8),
(235,'A50 OLED',8),
(236,'A42 5G',8),
(237,'A510/A5 2016',8),
(238,'A6+',8),
(239,'A7 2015',8),
(240,'A7 2018',8),
(241,'A71',8),
(242,'A8 2015',8),
(243,'E500/E5',8),
(244,'J3 PRO',8),
(245,'J4',8),
(246,'J6',8),
(247,'J7',8),
(248,'J7 NEO',8),
(249,'J7 PRO',8),
(250,'J8/J8+',8),
(251,'A20',8),
(252,'A22 4G',8),
(253,'A30',8),
(254,'A30 S',8),
(255,'A31 GRANDE',8),
(256,'A31 PEQUEÑA',8),
(257,'A32 4G',8),
(258,'A50',8),
(259,'A51 GRANDE',8),
(260,'A51 PEQUEÑA',8),
(261,'A52 4G',8),
(262,'A70 GRANDE',8),
(263,'A73',8),
(264,'NOTE 8',8),
(265,'NOTE 9',8),
(266,'NOTE 10',8),
(267,'NOTE 10+',8),
(268,'NOTE 20',8),
(269,'NOTE 20 ULTRA',8),
(270,'S8',8),
(271,'S8+',8),
(272,'S9',8),
(273,'S9+',8),
(274,'S10',8),
(275,'S10+',8),
(276,'S10E',8),
(277,'S20',8),
(278,'S20 ULTRA',8),
(279,'S20FE',8),
(280,'S21 FE',8),
(281,'S21',8),
(282,'S221 ULTRA',8),
(283,'S221 ULTRA',8),
(284,'S22 ULTRA',8),
(285,'S22+',8),
(286,'A03 CORE',8),
(287,'A03S/A02S/A03',8),
(288,'A10',8),
(289,'A10E/A20E',8),
(290,'A10S',8),
(291,'A12 UNIVERSAL',8),
(292,'A20S',8),
(293,'A22 4G',8),
(294,'A22 5G',8),
(295,'A30/A50',8),
(296,'A32 4G',8),
(297,'A40',8),
(298,'A52',8),
(299,'A52 4G',8),
(300,'A6+',8),
(301,'A60',8),
(302,'A7 2018',8),
(303,'A70',8),
(304,'A72 4G',8),
(305,'A8+',8),
(306,'A80',8),
(307,'J4+/J6+',8),
(308,'J5 PRIME',8),
(309,'J7 PRIME',8),
(310,'J737',8),
(311,'J8',8),
(312,'M10',8),
(313,'M20',8),
(314,'M21',8),
(315,'A20 C/M',8),
(316,'A30S C/M',8),
(317,'A02',8),
(318,'A10',8),
(319,'A10S',8),
(320,'A11',8),
(321,'A12 UNIVERSAL',8),
(322,'A20',8),
(323,'A20S',8),
(324,'A21S',8),
(325,'A23',8),
(326,'A30/A50',8),
(327,'A30S',8),
(328,'A31',8),
(329,'A51',8),
(330,'A70',8),
(331,'A71',8),
(332,'M21/M30/M30S/M31',8),
(333,'A3',8),
(334,'A5 METAL',8),
(335,'J1 2016',8),
(336,'J2',8),
(337,'J2 PRO',8),
(338,'J4',8),
(339,'J5 2016',8),
(340,'J5',8),
(341,'J5 PRO',8),
(342,'J7',8),
(343,'J7 2016',8),
(344,'J7 PRO',8);

insert into pantalla_modelo values
(345,'10L',9),
(346,'10SE',9),
(347,'20L',9),
(348,'20L+',9),
(349,'20SE',9),
(350,'30SE',9),
(351,'20 PRO 5G',9);

insert into pantalla_modelo values
(352,'CAMON 16 PREMIER',10),
(353,'CAMON 17',10),
(354,'CAMON 17P',10),
(355,'CAMON 18 PREMIER',10),
(356,'INFINIX HOT 10 LITE',10),
(357,'POP 4 LITE',10),
(358,'POP 4 V1',10),
(359,'POP 5 LITE',10),
(360,'POVA NEO',10),
(361,'SPARK 5',10),
(362,'SPARK 5 AIR',10),
(363,'SPARK 6 GO',10),
(364,'SPARK 6/CAMON 17',10),
(365,'SPARK 7',10),
(366,'SPARK 8 PRO',10);

insert into pantalla_modelo values
(367,'A11 PRO MAX',11),
(368,'A9 PRO',11),
(369,'BISON',11),
(370,'A7 PRO',11),
(371,'A7S',11),
(372,'A11S',11),
(373,'A13S',11);


insert into pantalla_modelo values
(374,'V21 5G',12),
(375,'Y11S',12),
(376,'Y20I',12),
(377,'Y21S',12),
(378,'Y30',12),
(379,'Y50',12),
(380,'Y51',12),
(381,'Y53S',12);

insert into pantalla_modelo values
(382,'MI 11 LITE',13),
(383,'MI 8 LITE',13),
(384,'MI 9 LITE',13),
(385,'MI 9 LITE OLED',13),
(386,'MI 9 SE OLED',13),
(387,'MI 9 SE',13),
(388,'MI A1',13),
(389,'MI A2',13),
(390,'MI A2 LITE/REDMI 6 PRO',13),
(391,'MI A3',13),
(392,'MI A3 OLED C/M',13),
(393,'MI G0',13),
(394,'MI NOTE 10 5G',13),
(395,'MI10T/MI10T PRO 5G',13),
(396,'MI9',13),
(397,'MI9 OLED',13),
(398,'MI9T/MI9T PRO',13),
(399,'MI9T/MI9T PRO OLED',13),
(400,'NOTE 10 PRO 5G/POCO X3 GT',13),
(401,'NOTE 6 PRO',13),
(402,'NOTE 10 LITE OLED',13),
(403,'NOTE 10 PRO INCELL',13),
(404,'NOTE 10 PRO OLED',13),
(405,'NOTE 5A',13),
(406,'POCO X3',13),
(407,'REDMI NOTE 9 PRO/NOTE 9S',13),
(408,'REDMI 10C',13),
(409,'REDMI 11T/11T PRO',13),
(410,'REDMI 4A',13),
(411,'REDMI 5',13),
(412,'REDMI 5+',13),
(413,'REDMI 5A',13),
(414,'REDMI 6A',13),
(415,'REDMI 9',13),
(416,'REDMI 9C/9A',13),
(417,'REDMI F1',13),
(418,'REDMI NOTE 10 INCELL',13),
(419,'REDMI NOTE 11 4G INCELL',13),
(420,'REDMI NOTE 1 4G OLED',13),
(421,'REDMI NOTE 11 PRO INCELL',13),
(422,'REDMI NOTE 11 PRO OLED',13),
(423,'REDMI NOTE 4X',13),
(424,'REDMI NOTE 5',13),
(425,'REDMI NOTE 8 PRO',13),
(426,'REDMI NOTE 9',13),
(427,'REDMI NOTE 9T',13),
(428,'REDMI NOTE 10 OLED',13),
(429,'REDMI NOTEd',13);





-- PERSONAS

insert into genero values
( 1, 'Masculino' ),
( 2, 'Femenino' );

insert into documento_identificacion VALUES
(1, 'DNI'),
(2, 'RUC'),
(3, 'CARNET DE EXTRANJERIA');

insert into establecimiento values (1, '10747190351', 'Confix Cell', 'servicio tecnico de celulares', 'Mcdo. Juan Velasco Alvarado, Sector 7, Grupo 1, Mz. ZC, Lote 1, Puesto 29, Villa el Salvador, Lima - Lima', 914505738);

-- usuarios
insert into usuario values
(0, 'Administrador', 'admin@confixcell.com', 'admin123',1  ),
(1, 'Jose', 'jose@confixcell.com', 'jose123', 1 ),
(2, 'Eliseo', 'eliseo@confixcell.com', 'eliseo123', 1 ),
(3, 'Marcos', 'marcos@confixcell.com', 'marcos123', 1 ),
(4, 'Maria', 'mariadogbarber.com', 'maria123', 1 );


-- clientes
INSERT INTO cliente (id, documento_identificacion_id, codigo, nombre, apellido, genero_id, celular, celular_respaldo)
VALUES
(1, 1, 'C001', 'Juan', 'Pérez', 1, 987654321, 912345678),
(2, 1, 'C002', 'María', 'García', 2, 987654321, 912345678),
(3, 1, 'C003', 'Carlos', 'López', 1, 987654321, 912345678),
(4, 1, 'C004', 'Ana', 'Martínez', 2, 987654321, 912345678),
(5, 1, 'C005', 'Luis', 'Rodríguez', 1, 987654321, 912345678),
(6, 2, 'C006', 'Sofía', 'Gómez', 2, 987654321, 912345678),
(7, 1, 'C007', 'Miguel', 'Hernández', 1, 987654321, 912345678),
(8, 1, 'C008', 'Laura', 'Díaz', 2, 987654321, 912345678),
(9, 1, 'C009', 'José', 'Fernández', 1, 987654321, 912345678),
(10, 1, 'C010', 'Elena', 'Ramírez', 2, 987654321, 912345678);






----- DOCUMENTOS TRANSACCIONALES

-- liquidacion_tipo
insert into liquidacion_tipo values
( 1, 'Al contado' ),
( 2, 'A crédito' );



--  NOTA DE VENTA
--  nota de venta al contado
INSERT INTO documento_transaccion (id, uuid, cod_serie, cod_numero, f_creacion, f_ejecucion, f_emision, f_anulacion, usuario_id, establecimiento_id, concepto, carpeta_id ) 
VALUES (1, '79fecc85-efaf-45f2-8a17-dddfd7a8f4c2', 'SERIE01', 1001, now(), NOW(), NOW(), NULL, 0, 1, null, null);

INSERT INTO nota_venta (id, cliente_id, receptor_documento_identificacion_id, receptor_cod, receptor_nombre, receptor_celular, liquidacion_tipo_id) 
VALUES (1, 2, 2, 'ABC123', 'Juan Perez', 987654321, 1);

INSERT INTO nota_venta_detalle (id, nota_venta_id, elemento_economico_id, concepto, cant, precio_uni, descuento, comentario) 
VALUES (1, 1, 3, 'Producto A', 2, 50.00, 5.00, 'Venta rápida');

INSERT INTO documento_movimiento (id, codigo, f_ejecucion, f_emision, f_anulacion, usuario_id, concepto, documento_transaccion_id) 
VALUES (1, 'MOV001', now(), now(), null, 0, null, 1);

INSERT INTO entrada_efectivo (id, efectivo) 
VALUES (1, 95.00);


-- nota de venta a credito
INSERT INTO documento_transaccion (id, cod_serie, cod_numero, f_creacion, f_ejecucion, f_emision, f_anulacion, usuario_id, establecimiento_id, concepto, carpeta_id ) 
VALUES (2, 'SERIE02', 1002, '2024-08-23 10:30:00', '2023-01-15 10:30:00', '2023-01-15 10:30:00', NULL, 0, 1, null, null);

INSERT INTO nota_venta (id, cliente_id, receptor_documento_identificacion_id, receptor_cod, receptor_nombre, receptor_celular, liquidacion_tipo_id) 
VALUES (2, 3, 3, 'XYZ456', 'Maria Lopez', 987123456, 2);

INSERT INTO nota_venta_detalle (id, nota_venta_id, elemento_economico_id, concepto, cant, precio_uni, descuento, comentario) 
VALUES (2, 2, 1, 'Producto B', 3, 75.00, 10.00, 'Pago a crédito');

INSERT INTO nota_venta_credito (id, nota_venta_id, tasa_interes_diario, importe_bruto, interes) VALUES
(1, 2, 0.05, 5000.00, 100.00);

INSERT INTO nota_venta_cuota (id, nota_venta_credito_id, numero, f_inicio, f_vencimiento, cuota, amortizacion, interes, saldo) VALUES
(1, 1, 1, '2023-01-15 10:30:00', '2023-02-15 10:30:00', 1000.00, 950.00, 50.00, 4000.00),
(2, 1, 2, '2023-02-15 10:30:00', '2023-03-15 10:30:00', 1000.00, 950.00, 50.00, 3000.00),
(3, 1, 3, '2023-03-15 10:30:00', '2023-04-15 10:30:00', 1000.00, 950.00, 50.00, 2000.00);


INSERT INTO documento_movimiento (id, codigo, f_ejecucion, f_emision, f_anulacion, usuario_id, concepto, documento_transaccion_id) VALUES
(2, 'MOV002', now(), now(), null, 1, null, 2),
(3, 'MOV003', '2023-01-20 16:30:00', '2023-01-20 16:30:00', NULL, 2, null, 2);

insert into entrada_efectivo ( id, efectivo ) values
(2, 150),
(3, 60);


-- LIMITE


-- nota de venta al contado
INSERT INTO documento_transaccion (id, cod_serie, cod_numero, establecimiento_id) 
VALUES (3, 'SERIE03', 1003, 1);

INSERT INTO nota_venta (id, f_creacion, f_emision, f_anulacion, liquidacion_tipo_id, usuario_id, cliente_id, receptor_documento_identificacion_id, receptor_cod, receptor_nombre, receptor_celular) 
VALUES (3, NOW(), NULL, NULL, 1, 3, 4, 1, 'DEF789', 'Carlos Rivera', 987654000);

INSERT INTO nota_venta_detalle (id, nota_venta_id, elemento_economico_id, concepto, cant, precio_uni, descuento, comentario) 
VALUES (3, 3, 2, 'Producto C', 1, 120.00, 15.00, 'Pago contado con descuento');

INSERT INTO documento_movimiento (id, codigo, documento_mercantil_id) 
VALUES (3, 'MOV003', 3);

INSERT INTO entrada_efectivo_contado (id, f_creacion, f_emision, f_anulacion, concepto, efectivo) 
VALUES (3, NOW(), NULL, NULL, 'Pago Contado', 105.00);


-- nota de venta a credito
INSERT INTO documento_transaccion (id, cod_serie, cod_numero, establecimiento_id) 
VALUES (4, 'SERIE02', 1003, 1);

INSERT INTO nota_venta (id, f_creacion, f_emision, f_anulacion, liquidacion_tipo_id, usuario_id, cliente_id, receptor_documento_identificacion_id, receptor_cod, receptor_nombre, receptor_celular) 
VALUES (4, '2024-08-23 10:30:00', '2024-08-23 19:24:08', NULL, 2, 2, 3, 3, 'XYZ456', 'Maria Lopez', 987123456);

INSERT INTO nota_venta_detalle (id, nota_venta_id, elemento_economico_id, concepto, cant, precio_uni, descuento, comentario) 
VALUES (4, 4, 1, 'Producto B', 3, 75.00, 10.00, 'Pago a crédito');

INSERT INTO documento_movimiento (id, codigo, documento_mercantil_id) 
VALUES (4, 'MOV004', 4);

INSERT INTO entrada_efectivo_credito (id, f_creacion, f_emision, f_archivacion, f_anulacion, concepto, efectivo, tasa_interes_diario) 
VALUES (4, '2024-08-23 10:30:00', '2024-08-23 19:24:08', '2025-08-23 19:24:08', NULL,'Crédito a pagar', 510.00, 0.5);

INSERT INTO entrada_cuota (id, entrada_efectivo_credito_id, f_vencimiento, amortizacion, interes, cuota, mora) 
VALUES (3, 4, '2024-09-15 00:00:00', null, null, null, null);

insert into cobro ( id, entrada_cuota_id, fecha, monto ) values
(4, 3, '2024-08-29 12:00:00', 150),
(5, 3, '2024-09-10 16:30:00', 60);

INSERT INTO entrada_cuota (id, entrada_efectivo_credito_id, f_vencimiento, amortizacion, interes, cuota, mora) 
VALUES (4, 4, '2024-10-15 00:00:00', null, null, null, null);

insert into cobro ( id, entrada_cuota_id, fecha, monto ) values
(6, 4, '2024-08-29 12:00:00', 95);







INSERT INTO documento_transaccion (id, cod_serie, cod_numero, establecimiento_id) VALUES
(1, 'A001', 12345, 1),
(2, 'A001', 12346, 1);

INSERT INTO comprobante_ingreso (id) VALUES
(1),
(2);

INSERT INTO nota_venta (id, f_creacion, f_emision, f_anulacion, liquidacion_tipo_id, usuario_id, cliente_id, receptor_documento_identificacion_id, receptor_cod, receptor_nombre, receptor_celular) VALUES
(1, '2024-09-16 10:00:00', '2024-09-16 10:30:00', NULL, 1, 1, 1, 1, 'C123456', 'Cliente Uno', 9876543210),
(2, '2024-09-16 11:00:00', '2024-09-16 11:30:00', NULL, 2, 2, 2, 2, 'C654321', 'Cliente Dos', 9876543220);

INSERT INTO nota_venta_detalle (id, nota_venta_id, elemento_economico_id, concepto, cant, precio_uni, descuento, comentario) VALUES
(1, 1, 1, 'Producto A', 2, 50.00, 5.00, 'Primera venta del día'),
(2, 1, 2, 'Producto B', 1, 100.00, 10.00, 'Venta adicional'),
(3, 2, 1, 'Producto C', 3, 75.00, 7.50, 'Cliente frecuente'),
(4, 2, 3, 'Producto D', 5, 40.00, 4.00, 'Descuento aplicado');








insert into documento_transaccion ( id, cod_serie, cod_numero, establecimiento_id ) values
( 1,'A001', 123, 1 ),
( 2,'A001', 124, 1 ),
( 3,'A002', 125, 1 ),
( 4,'A001', 1001, 1 ),
( 5,'A001', 1002, 1 ),
( 6,'B002', 2001, 1 ),
( 7,'B002', 2002, 1 ),
( 8,'C003', 3001, 1 );

INSERT INTO nota_venta 
(id, f_creacion, f_emision, f_anulacion, liquidacion_tipo_id, usuario_id, cliente_id, receptor_documento_identificacion_id, receptor_cod, receptor_nombre, receptor_celular) 
VALUES
(1, '2024-08-23 10:30:00', '2024-08-23 10:45:00', NULL, 1, 3, 1, 1, 'ABC123', 'Juan Perez', 987654321),
(2, '2024-08-22 12:00:00', '2024-08-22 12:30:00', NULL, 2, 3, 2, 2, 'XYZ789', 'Maria Gomez', 912345678),
(3, '2024-08-21 08:00:00', '2024-08-21 08:15:00', NULL, 2, 4, 3, 3, 'DEF456', 'Carlos Martinez', 987123456),
(4, '2024-08-01 10:15:30', '2024-08-01 10:20:30', '2024-08-21 09:00:00', 1, 1, 1, 1, 'DNI-12345678', 'Juan Perez', 987654321),
(5, '2024-08-01 12:25:45', '2024-08-01 12:30:45', NULL, 1, 2, 2, 1, 'RUC-987654321', 'Empresa XYZ', 912345678),
(6, '2024-08-02 09:10:00', '2024-08-02 09:15:00', NULL, 1, 3, 3, 2, 'DNI-87654321', 'Maria Gomez', 921234567),
(7, '2024-08-02 14:30:15', '2024-08-02 14:35:15', NULL, 1, 1, 1, 3, 'RUC-123987456', 'Comercial ABC', 934567890),
(8, '2024-08-03 11:45:20', '2024-08-03 11:50:20', NULL, 1, 2, 2, 1, 'DNI-56781234', 'Carlos Ruiz', 945678123);

INSERT INTO nota_venta_detalle 
(id, nota_venta_id, elemento_economico_id, concepto, cant, precio_uni, descuento, comentario) 
VALUES
(1, 1, 1, 'Producto A', 2.00, 50.00, 5.00, 'Descuento por promoción'),
(2, 1, 2, 'Producto B', 1.00, 100.00, 0.00, 'Sin descuento'),
(3, 2, 1, 'Producto A', 3.00, 50.00, 7.50, 'Descuento por cantidad'),
(4, 3, 3, 'Producto C', 1.50, 75.00, 0.00, 'Producto sin descuento'),
(5, 4, 1, 'Producto A', 5.00, 10.00, 0.50, 'Promoción'),
(6, 4, 2, 'Producto B', 2.00, 15.00, 1.00, 'Descuento por volumen'),
(7, 5, 3, 'Servicio X', 1.00, 100.00, 10.00, 'Incluye soporte técnico'),
(8, 6, 4, 'Producto C', 10.00, 8.50, 0.00, 'Sin descuento'),
(9, 6, 5, 'Producto D', 7.50, 12.00, 0.75, 'Descuento especial'),
(10, 7, 6, 'Producto E', 3.00, 20.00, 2.00, 'Oferta del día'),
(11, 8, 7, 'Producto F', 6.00, 25.00, 1.50, 'Cliente frecuente');

INSERT INTO nota_venta_detalle 
(id, nota_venta_id, elemento_economico_id, concepto, cant, precio_uni, descuento, comentario) 
VALUES
(12, 8, null, null, null, null, 5.00, null);

INSERT INTO nota_venta_detalle 
(id, nota_venta_id, elemento_economico_id, concepto, cant, precio_uni, descuento, comentario) 
VALUES
(13, 8, null, null, 2, null, null, null);




insert into documento_entrada ( id, codigo, documento_mercantil_id ) values
( 1, 'DOCNTRD1', 1 ),
( 2, 'DOCNTRD2', 2 ),
( 3, 'DOCNTRD3', 3 ),
( 4, 'DOCNTRD4', 4 ),
( 5, 'DOCNTRD5', 5 ),
( 6, 'DOCNTRD6', 6 ),
( 7, 'DOCNTRD7', 7 ),
( 8, 'DOCNTRD8', 8 );

--- efectivo 
insert into entrada_efectivo_contado ( id, f_creacion, f_emision, f_anulacion, concepto, efectivo ) values
( 1, '2024-08-23 10:30:00', '2024-08-23 10:45:00', NULL, 'A001-123', 500 ),
( 4, '2024-08-01 10:15:30', '2024-08-01 10:20:30', '2024-08-21 09:00:00', 'A001-1001', 700 ),
( 5, '2024-08-01 12:25:45', '2024-08-01 12:30:45', NULL, 'A001-1002', 600 ),
( 6, '2024-08-02 09:10:00', '2024-08-02 09:15:00', NULL, 'B002-2001', 850 ),
( 7, '2024-08-02 14:30:15', '2024-08-02 14:35:15', NULL, 'B002-2002',240 ),
( 8, '2024-08-03 11:45:20', '2024-08-03 11:50:20', NULL, 'C003-3001', 40 );

--- credito
insert into entrada_efectivo_credito ( id, f_creacion, f_emision, f_anulacion, concepto, tasa_interes_diario, efectivo ) values
( 2, '2024-08-22 12:00:00', '2024-08-22 12:30:00', NULL, 'A001-124', 0.25, 600 ),
( 3, '2024-08-21 08:00:00', '2024-08-21 08:15:00', NULL, 'A002-125', 0.25, 500 );


create table prueba(
    id int primary key,
    valor1 varchar(50)
);
alter table prueba add constraint g100 unique( valor1 );

insert into prueba values
( 4, 'A' );

create table prueba2(
    id int primary key,
    valor1 varchar(50) unique
);

insert into prueba2 values
( 2, null );