import asyncio
import time

def suma_cuadrados(n):
    total = 0
    for i in range(n):
        total += i * i
    return total

async def tarea(nombre, n):
    print(f"{nombre} iniciada")
    resultado = suma_cuadrados(n)
    print(f"{nombre} terminada con resultado {resultado}")

async def main():
    await asyncio.gather(
        tarea("Tarea 1", 10**7),
        tarea("Tarea 2", 10**7)
    )

start = time.time()
asyncio.run(main())
end = time.time()

print(f"Tiempo total (asyncio, concurrencia): {end - start:.2f} segundos")