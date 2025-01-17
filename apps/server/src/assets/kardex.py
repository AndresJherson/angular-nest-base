# %%
import pandas as pd
import urllib
from sqlalchemy import create_engine, text
import sys
import json
from datetime import datetime

sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

# validaciones
def is_numeric(valor):
    return isinstance(valor, (int, float))

def is_string(valor):
    return isinstance(valor, str)


def is_format_valid(valor, formatos):
    if not isinstance(valor, str):
        return False
    for formato in formatos:
        try:
            datetime.strptime(valor, formato)
            return True
        except ValueError:
            continue
    return False

def is_date(valor):
    formatos_fecha = ["%Y-%m-%d", "%d/%m/%Y", "%m-%d-%Y"]
    return is_format_valid(valor, formatos_fecha)

def is_datetime(valor):
    formatos_fecha_hora = ["%Y-%m-%d %H:%M:%S", "%d/%m/%Y %H:%M:%S", "%m-%d-%Y %H:%M:%S"]
    return is_format_valid(valor, formatos_fecha_hora)

def is_time(valor):
    formatos_hora = ["%H:%M:%S", "%H:%M"]
    return is_format_valid(valor, formatos_hora)


def is_dictionary(valor):
    return isinstance(valor, dict)

def flush_out_finish( data ):
    sys.stdout.write( json.dumps( data ) )
    sys.stdout.flush()
    sys.exit( 0 )

def flush_error_finish( message ):
    sys.stderr.write( message )
    sys.stderr.flush()
    sys.exit( 1 )


input_data = sys.stdin.read()
input_json = {}

try:
    input_json = json.loads( input_data )
except json.JSONDecodeError:
    flush_error_finish( 'No se proporcionó datos válidos' )

if is_dictionary( input_json ) == False:
    flush_error_finish( 'No se proporcionó datos válidos' )
    
if 'id' not in input_json or is_numeric( input_json['id'] ) == False:
    flush_error_finish( 'Id inválido' )
    
if 'type' not in input_json or is_string( input_json['type'] ) == False:
    flush_error_finish( 'Tipo de bien inválido' )

# %%
# Leer datos con pandas
query2Pantalla = text( """
with movimientos as (

    select

        documento_movimiento.f_emision as fecha,
        documento_movimiento.concepto as concepto,
        documento_movimiento.codigo as codigoDocumentoMovimiento,
        concat( documento_transaccion.cod_serie, '-', documento_transaccion.cod_numero ) as codigoDocumentoTransaccion,

        entrada_pantalla_detalle.cant as entradaCantidad,
        entrada_pantalla_detalle.costo_uni as entradaCostoUnitario,
        ( entrada_pantalla_detalle.cant * entrada_pantalla_detalle.costo_uni ) as entradaCostoTotal,

        null as salidaCantidad,
        null as salidaCostoUnitario,
        null as salidaCostoTotal

    from entrada_pantalla_detalle
    left join entrada_pantalla on entrada_pantalla.id = entrada_pantalla_detalle.entrada_pantalla_id
    left join documento_movimiento on documento_movimiento.id = entrada_pantalla.id
    left join documento_transaccion on documento_transaccion.id = documento_movimiento.documento_transaccion_id
    where documento_movimiento.f_anulacion is null
    and entrada_pantalla_detalle.pantalla_modelo_calidad_id = :id

    union all

    select

        documento_movimiento.f_emision as fecha,
        documento_movimiento.concepto as concepto,
        documento_movimiento.codigo as codigoDocumentoMovimiento,
        concat( documento_transaccion.cod_serie, '-', documento_transaccion.cod_numero ) as codigoDocumentoTransaccion,

        null as entradaCantidad,
        null as entradaCostoUnitario,
        null as entradaCostoTotal,

        salida_pantalla_detalle.cant as salidaCantidad,
        null as salidaCostoUnitario,
        null as salidaCostoTotal

    from salida_pantalla_detalle
    left join salida_pantalla on salida_pantalla.id = salida_pantalla_detalle.salida_pantalla_id
    left join documento_movimiento on documento_movimiento.id = salida_pantalla.id
    left join documento_transaccion on documento_transaccion.id = documento_movimiento.documento_transaccion_id
    where documento_movimiento.f_anulacion is null
    and salida_pantalla_detalle.pantalla_modelo_calidad_id = :id

)
select *
from movimientos
order by movimientos.fecha;
""" )

query2Producto = text("""
    with movimientos as (

    select

        documento_movimiento.f_emision as fecha,
        documento_movimiento.concepto as concepto,
        documento_movimiento.codigo as codigoDocumentoMovimiento,
        concat( documento_transaccion.cod_serie, '-', documento_transaccion.cod_numero ) as codigoDocumentoTransaccion,

        entrada_producto_detalle.cant as entradaCantidad,
        entrada_producto_detalle.costo_uni as entradaCostoUnitario,
        ( entrada_producto_detalle.cant * entrada_producto_detalle.costo_uni ) as entradaCostoTotal,

        null as salidaCantidad,
        null as salidaCostoUnitario,
        null as salidaCostoTotal

    from entrada_producto_detalle
    left join entrada_producto on entrada_producto.id = entrada_producto_detalle.entrada_producto_id
    left join documento_movimiento on documento_movimiento.id = entrada_producto.id
    left join documento_transaccion on documento_transaccion.id = documento_movimiento.documento_transaccion_id
    where documento_movimiento.f_anulacion is null
    and entrada_producto_detalle.producto_id = :id

    union all
    
    select

        documento_movimiento.f_emision as fecha,
        documento_movimiento.concepto as concepto,
        documento_movimiento.codigo as codigoDocumentoMovimiento,
        concat( documento_transaccion.cod_serie, '-', documento_transaccion.cod_numero ) as codigoDocumentoTransaccion,

        null as entradaCantidad,
        null as entradaCostoUnitario,
        null as entradaCostoTotal,

        salida_producto_detalle.cant as salidaCantidad,
        null as salidaCostoUnitario,
        null as salidaCostoTotal

    from salida_producto_detalle
    left join salida_producto on salida_producto.id = salida_producto_detalle.salida_producto_id
    left join documento_movimiento on documento_movimiento.id = salida_producto.id
    left join documento_transaccion on documento_transaccion.id = documento_movimiento.documento_transaccion_id
    where documento_movimiento.f_anulacion is null
    and salida_producto_detalle.producto_id = :id

)
select *
from movimientos
order by movimientos.fecha;
""")

query = ''

if input_json['type'] == 'Producto':
    query = query2Producto
elif input_json['type'] == 'PantallaModeloCalidad':
    query = query2Pantalla
else:
    flush_error_finish( 'Tipo de bien inválido' )


connection_string = (
    "DRIVER=MySQL ODBC 9.1 ANSI Driver;"
    "SERVER=localhost;"
    "PORT=3306;"
    "DATABASE=servicio_tecnico;"
    "UID=root;"
    "PWD=root123;"
    "charset=utf8mb4;"
)

params = urllib.parse.quote_plus(connection_string)
connection_uri = "mysql+pyodbc:///?odbc_connect=%s" % params
engine = create_engine( connection_uri )

con = engine.connect()
result = con.execute( query, { "id": input_json['id'] } )
con.close()
data = result.fetchall()

if ( len( data ) == 0 ):
    flush_out_finish( [] )

df = pd.DataFrame( data )
df = df.astype({
    'fecha': 'datetime64[ns]',
    'concepto': 'object',
    'codigoDocumentoMovimiento': 'object',
    'codigoDocumentoTransaccion': 'object',
    'entradaCantidad': 'float64',
    'entradaCostoUnitario': 'float64',
    'entradaCostoTotal': 'float64',
    'salidaCantidad': 'float64',
    'salidaCostoUnitario': 'float64',
    'salidaCostoTotal': 'float64',
})

# %%
saldoCantidad = 0
saldoValorUnitario = 0
saldoValorTotal = 0

for index, row in df.iterrows():
    
    if pd.isna( row['salidaCantidad'] ) == False:
        df.at[index, 'salidaCostoUnitario'] = saldoValorUnitario
        df.at[index, 'salidaCostoTotal'] = saldoValorUnitario * row['salidaCantidad']
    
    saldoCantidad = saldoCantidad + ( 0 if pd.isna( row['entradaCantidad'] ) else row['entradaCantidad'] ) - ( 0 if pd.isna( row['salidaCantidad'] ) else row['salidaCantidad'] )    
    saldoValorTotal = saldoValorTotal + ( 0 if pd.isna( row['entradaCostoTotal'] ) else row['entradaCostoTotal'] ) - ( 0 if pd.isna( row['salidaCantidad'] ) else saldoValorUnitario * row['salidaCantidad'] )
    
    try:
        saldoValorUnitario = saldoValorTotal / saldoCantidad
    except:
        saldoValorUnitario = 0
    
    df.at[index, 'saldoCantidad'] = saldoCantidad
    df.at[index, 'saldoValorUnitario'] = saldoValorUnitario
    df.at[index, 'saldoValorTotal'] = saldoValorTotal

# %%
dict_total = {
    "entradaCantidadTotal": df['entradaCantidad'].sum( skipna=True ),
    "entradaCostoTotal": df['entradaCostoTotal'].sum( skipna=True ),
    "salidaCantidadTotal": df['salidaCantidad'].sum( skipna=True ),
    "salidaCostoTotal": df['salidaCostoTotal'].sum( skipna=True ),
    "existencias": df.at[df.index[-1], 'saldoCantidad'],
    "costoUnitarioSalida": df.at[df.index[-1],'saldoValorUnitario'],
    "valorTotal": df.at[df.index[-1], 'saldoValorTotal']
}

# %%
json_movimientos = df.to_json( orient='records', date_format='iso', force_ascii=False )

# %%
dict_data = {
    "movimientos": json.loads( json_movimientos ),
    "total": dict_total
}

print( json.dumps( dict_data, default=str, ensure_ascii=False ) )
sys.stdout.flush()


