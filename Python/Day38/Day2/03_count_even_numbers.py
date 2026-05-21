print("Even numbers between 1 and 100:")
count = 0
for i in range(1, 101):
    if i % 2 == 0:
        print(i, end=" ")
        count += 1
print(f"\nTotal even numbers: {count}")
