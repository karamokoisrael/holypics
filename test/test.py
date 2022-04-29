import time
#projet de naomi et prosper :)


#On considère la suite (un)n2N définie par les conditions :
      #u0 = 42 et pour tout n > 1; un = (16383 × un-1) mod 59047

def u(n):
    a = 42
    for i in range(1,n+1):
        b = (16383 * a) % 59047
        a = b
    return a

#Question 1: Que valent u996 et u9996 ?

print(u(996))
# u996 = 58034 u9996 = 8178
print(u(9996))
#u9996 = 8178

#On définit vi = 1 si ui ≡ 0 mod 3 et vi = 0 sinon. Combien y a-t-il d’indices i tels que vi = 0,
                   #pour 0 <= i < 10000 ?

def v(n):
    m = 0
    for i in range(n+1):
        if u(i) % 3 == 0:
            m = 1
        else:
            m = m
    return m

#On définit la fonction qui permettra de compter le nombre d'indices
def nb_indice(n):
    L = []
    for i in range(1001):
        if v(i) == 0:
            L.append(i)
    return len(L)
start_time = time.time()
print("the program has started")
# print(nb_indice(1))
print(u())
print("the program took {}".format(time.time() - start_time))