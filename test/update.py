import time

u_all = [42]
u_max = 10000

for i in range(1,u_max):
    b = (16383 * u_all[len(u_all)-1]) % 59047
    u_all.append(b)
    
def u(n):
    return u_all[n]

print(u(996))
print(u(9996))

def v(n):
    for i in range(n+1):
        # m = 1 if u(i) % 3 == 0 else 0
        if u(i) % 3 == 0:
            m = 1
        else:
            m = 0
    return m

def nb_indice(n):
    current = 0
    for i in range(0,n):
        if v(i) == 0:
            current+=1
    return current


start_time = time.time()
print("the program has started")
print(nb_indice(10000))
print("the program took {}".format(time.time() - start_time))