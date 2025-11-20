from multiprocessing import Process
import time

def suma_cuadrados(n):
    total = 0
    for i in range(n):
        total += i * i
    return total

def tarea(nombre, n):
    print(f"{nombre} iniciada")
    resultado = suma_cuadrados(n)
    print(f"{nombre} terminada con resultado {resultado}")

if __name__ == "__main__":
    p1 = Process(target=tarea, args=("Tarea 1", 10**7))
    p2 = Process(target=tarea, args=("Tarea 2", 10**7))

    start = time.time()
    p1.start()
    p2.start()

    p1.join()
    p2.join()
    end = time.time()

    print(f"Tiempo total (multiprocessing, paralelismo): {end - start:.2f} segundos")